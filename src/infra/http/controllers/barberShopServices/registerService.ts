import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { ProfissionalService, Category, BarberShopsServices } from "../../../../shared";
import { getIO } from "../socket/sockets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


export const registerService = async (req: Request, res: Response) => {
  const { barbersShopsId } = req.params;
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    let imageURL = ""

    if (file && file.filepath) {
      imageURL = `/uploads/${path.basename(file.filepath)}`;
    }


    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;



    if (!name || !price) {
      return res.status(400).json({ message: "Os campos nomes e precos são obrigatórios." });
    }

    try {
      console.log({
        name,
        description,
        price,
        barbersShopsId,
        category,
        image: imageURL,
      })
      const findCategory = await Category.findById(category);
      if (!findCategory) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      const service = new BarberShopsServices({
        name,
        description,
        price,
        barbersShopsId,
        category,
        image: imageURL,
      })

      await service.save();
      const updatedServices = await BarberShopsServices.find({})
        .populate('category', '_id name')
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("barberShopsServices", updatedServices);

      res.status(200).json({ message: "Serviço adicionado com sucesso", services: service });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar serviço", error });
    }
  });
};