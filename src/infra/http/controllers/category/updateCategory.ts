import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { Category } from "../../../../shared";
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

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingProduct = await Category.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      // Extrair campos
      const name = getFieldValue(fields.name);
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Atualizar imagem se houver novo arquivo
      let imageURL = existingProduct.image;
      if (file?.filepath) {
        imageURL = `/uploads/${path.basename(file.filepath)}`;
      }

      // Atualizar serviço
      const updatedService = await Category.findByIdAndUpdate(
        id,
        {
          name: name ?? existingProduct.name,
          image: imageURL,
        },
        { new: true }
      );

      // Emitir atualização via socket
      const updateProduct = await Category.find({})
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("category", updateProduct);

      return res.status(200).json({
        message: "Categoria editada com sucesso",
        service: updatedService,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno ao atualizar a categoria.",
      });
    }
  });
};
