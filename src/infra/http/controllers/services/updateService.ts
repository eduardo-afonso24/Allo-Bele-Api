import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { ProfissionalService, Category } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;



    try {
      const findService = await ProfissionalService.findById(serviceId);
      if (!findService) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      let imageURL = ""

      if (file && file.filepath) {
        imageURL = `/uploads/${path.basename(file.filepath)}`;
      }

      const service = await ProfissionalService.findByIdAndUpdate(serviceId, {
        serviceName: name ? name : findService.serviceName,
        price: price ? price : findService.price,
        category: category ? category : findService.category,
        description: description ? description : findService.description,
        image: imageURL ? imageURL : findService.image,
      },
        { new: true });

      console.log({ service })

      console.log({ serviceName: name, price, category, description })

      res.status(200).json({ message: "Serviço editado com sucesso", service });
    } catch (error) {
      console.error("Erro ao atualizar os dados do servico:", error);
      return res.status(500).json({ message: "Ocorreu um erro ao Atualizar os dados do servico." });
    }
  });
};