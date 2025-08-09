import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { Promotions } from "../../../../shared";
import { getIO } from "../socket/sockets";

// Configurações de caminho
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper para extrair valor de campo
const getFieldValue = <T = string>(field: T | T[] | undefined): T | undefined =>
  Array.isArray(field) ? field[0] : field;

export const updatePromotions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingPromotions = await Promotions.findById(id);
      if (!existingPromotions) {
        return res.status(404).json({ message: "Promoção não encontrada" });
      }

      // Extrair campos do form
      const title = getFieldValue(fields.title);
      const brand = getFieldValue(fields.brand);
      const description = getFieldValue(fields.description);
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Atualizar imagem se houver novo arquivo
      let imageURL = existingPromotions.image;

      if (file?.filepath) {
        const ext = path.extname(file.originalFilename || file.filepath);
        const filename = `${Date.now()}_${Math.round(Math.random() * 1e5)}${ext}`;
        const newPath = path.join(uploadDir, filename);

        // Apaga imagem antiga (se houver)
        if (
          existingPromotions.image &&
          existingPromotions.image.startsWith("/uploads/")
        ) {
          const oldPath = path.join(uploadDir, path.basename(existingPromotions.image));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Renomeia o arquivo salvo
        fs.renameSync(file.filepath, newPath);
        imageURL = `/uploads/${filename}`;
      }

      // Atualizar promoção no banco
      const promotions = await Promotions.findByIdAndUpdate(
        id,
        {
          title: title ?? existingPromotions.title,
          description: description ?? existingPromotions.description,
          image: imageURL,
          brand: brand ?? existingPromotions.brand,
        },
        { new: true }
      );

      // Emitir evento via socket
      const updatePromotions = await Promotions.find({}).sort({ timestamp: -1 }).lean();
      getIO().emit("promotions", updatePromotions);

      return res.status(200).json({
        message: "Promoção editada com sucesso",
        promotions,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno ao atualizar a promoção.",
      });
    }
  });
};
