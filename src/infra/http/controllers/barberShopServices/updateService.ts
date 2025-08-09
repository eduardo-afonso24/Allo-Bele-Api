import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Request, Response } from "express";
import { BarberShopsServices, ProfissionalService } from "../../../../shared";
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

export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer upload do arquivo." });
    }

    try {
      const existingService = await BarberShopsServices.findById(serviceId);
      if (!existingService) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      // Extrair campos
      const name = getFieldValue(fields.name);
      const price = getFieldValue(fields.price);
      const description = getFieldValue(fields.description);
      const category = getFieldValue(fields.category);
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Atualizar imagem se houver novo arquivo
      let imageURL = existingService.image;
      if (file?.filepath) {
        imageURL = `/uploads/${path.basename(file.filepath)}`;
      }

      // Atualizar serviço
      const updatedService = await BarberShopsServices.findByIdAndUpdate(
        serviceId,
        {
          name: name ?? existingService.name,
          price: price ?? existingService.price,
          description: description ?? existingService.description,
          category: category ?? existingService.category,
          image: imageURL,
        },
        { new: true }
      );

      // Emitir atualização via socket
      const updatedServices = await BarberShopsServices.find({})
        .populate("category", "_id name")
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("barberShopsServices", updatedServices);

      return res.status(200).json({
        message: "Serviço editado com sucesso",
        service: updatedService,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno ao atualizar o serviço.",
      });
    }
  });
};
