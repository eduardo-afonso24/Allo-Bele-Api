import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { Products, ProfissionalService } from "../../../../shared";
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

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingProduct = await Products.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      // Extrair campos
      const name = getFieldValue(fields.name);
      const price = getFieldValue(fields.price);
      const description = getFieldValue(fields.description);
      const category = getFieldValue(fields.category);
      const brand = getFieldValue(fields.brand);
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Atualizar imagem se houver novo arquivo
      let imageURL = existingProduct.image;
      if (file?.filepath) {
        imageURL = `/uploads/${path.basename(file.filepath)}`;
      }
      // Atualizar serviço
      const updatedService = await Products.findByIdAndUpdate(
        id,
        {
          name: name ?? existingProduct.name,
          price: price ?? existingProduct.price,
          description: description ?? existingProduct.description,
          category: category ?? existingProduct.category,
          brand: brand ?? existingProduct.brand,
          image: imageURL,
        },
        { new: true }
      );

      // Emitir atualização via socket
      const updateProduct = await Products.find({})
        .populate("category", "_id name")
        .populate("brand", "_id name")
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("products", updateProduct);

      return res.status(200).json({
        message: "Produto editado com sucesso",
        service: updatedService,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno ao atualizar o produto.",
      });
    }
  });
};
