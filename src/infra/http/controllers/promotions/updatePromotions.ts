import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { Promotions } from "../../../../shared";
import { getIO } from "../socket/sockets";

// Garantir diretório de uploads
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper para extrair valor único de campo ou undefined
const getFieldValue = <T = string>(field: T | T[] | undefined): T | undefined =>
  Array.isArray(field) ? field[0] : field;

export const updatePromotions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      console.error("Erro no upload:", err);
      return res
        .status(500)
        .json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingPromotions = await Promotions.findById(id);
      if (!existingPromotions) {
        return res.status(404).json({ message: "Promoção não encontrado" });
      }

      // Extrair campos
      const title = getFieldValue(fields.title);
      const description = getFieldValue(fields.description);
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Atualizar imagem se houver novo arquivo
      let imageURL = existingPromotions.image;
      if (file?.filepath) {
        imageURL = `/uploads/${path.basename(file.filepath)}`;
      }

      console.log({
        title: title ?? existingPromotions.title,
        description: description ?? existingPromotions.description,
        image: imageURL,
        file: file ? file.filepath : "Nenhum arquivo enviado",
      });
      // Atualizar serviço
      const promotions = await Promotions.findByIdAndUpdate(
        id,
        {
          title: title ?? existingPromotions.title,
          description: description ?? existingPromotions.description,
          image: imageURL,
        },
        { new: true }
      );

      // Emitir atualização via socket
      const updatePromotions = await Promotions.find({})
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("promotions", updatePromotions);

      return res.status(200).json({
        message: "Promoção editada com sucesso",
        promotions: promotions,
      });
    } catch (error) {
      console.error("Erro ao atualizar o promoções:", error);
      return res.status(500).json({
        message: "Erro interno ao atualizar o promoções.",
      });
    }
  });
};
