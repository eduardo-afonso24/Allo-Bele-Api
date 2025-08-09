import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { BarbersShops } from "../../../../shared";
import { getIO } from "../socket/sockets";

// Setup de diretório
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper
const getFieldValue = <T = string>(field: T | T[] | undefined): T | undefined =>
  Array.isArray(field) ? field[0] : field;

export const updateBarbersShops = async (req: Request, res: Response) => {
  const { id } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingShop = await BarbersShops.findById(id);
      if (!existingShop) {
        return res.status(404).json({ message: "BarbersShops não encontrado" });
      }

      // Campos proibidos de serem atualizados
      const forbiddenFields = [
        "password",
        "status",
        "occupied",
        "isBlocked",
        "role",
        "verificationByEmailToken",
        "verificationByEmailExpires",
        "token",
        "professionalServices",
        "bookmarks",
        "confirmationMessages",
      ];

      // Prepara os dados para atualização
      const updates: any = {};

      // Itera sobre os campos recebidos
      for (const key in fields) {
        if (!forbiddenFields.includes(key)) {
          const value = getFieldValue(fields[key]);

          // Se for um campo de localização aninhado
          if (key === "latitude" || key === "longitude") {
            updates.location = updates.location || {};
            updates.location[key] = parseFloat(value as string);
          } else if (key === "avatar") {
            // Se for avatar como string JSON ou array
            try {
              const avatarArray = typeof value === "string" ? JSON.parse(value) : value;
              if (Array.isArray(avatarArray)) {
                updates.avatar = avatarArray;
              }
            } catch {
              console.warn("Avatar inválido, ignorando.");
            }
          } else {
            updates[key] = value;
          }
        }
      }

      // Atualiza imagem principal se enviada via arquivo
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (file?.filepath) {
        updates.image = `/uploads/${path.basename(file.filepath)}`;
      }

      const updatedShop = await BarbersShops.findByIdAndUpdate(id, updates, { new: true });

      // Envia atualização para os clientes via socket
      const allShops = await BarbersShops.find({}).sort({ createdAt: -1 }).lean();
      getIO().emit("barbersShops", allShops);

      return res.status(200).json({
        message: "BarbersShop atualizado com sucesso",
        shop: updatedShop,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno ao atualizar o BarbersShops." });
    }
  });
};
