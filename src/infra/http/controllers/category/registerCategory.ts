import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Category } from "../../../../shared";
import { getIO } from "../socket/sockets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


export const registerCategory = async (req: Request, res: Response) => {
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

    if (!name) {
      return res.status(400).json({ message: "O campos nome é obrigatório." });
    }

    try {


      const produt = new Category({
        name,
        image: imageURL,
      })

      await produt.save();
      const updateProduct = await Category.find({})
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("category", updateProduct);

      res.status(200).json({ message: "Categoria adicionada com sucesso", produts: produt });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar a Categoria", error });
    }
  });
};