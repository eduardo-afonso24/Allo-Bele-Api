import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Pubs, User } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const updatePubs = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;


    try {
      const existingPubs = await Pubs.findById(id);
      if (!existingPubs) {
        return res.status(404).json({ message: "Post nao encontrado." });
      }

      let avatarUrl = ""

      if (file && file.filepath) {
        avatarUrl = `/uploads/${path.basename(file.filepath)}`;
      }

      const pubs = await Pubs.findByIdAndUpdate(existingPubs._id, {
        message: message ? message : existingPubs.message,
        image: avatarUrl ? avatarUrl : existingPubs.image,
      },
        { new: true });
      return res.status(200).json({ pubs });
    } catch (error) {
      console.error("Erro ao atualizar os dados do post:", error);
      return res.status(500).json({ message: "Ocorreu um erro ao r os dados do post." });
    }
  });
};