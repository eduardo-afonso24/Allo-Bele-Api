import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Pubs } from "../../../../shared";
import { getIO } from "../socket/sockets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


export const createPubs = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file || !file.filepath) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado ou arquivo inválido.' });
    }
    const imagensUrl = `/uploads/${path.basename(file.filepath)}`;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
    try {
      const newPub = new Pubs({
        message,
        image: imagensUrl ? imagensUrl : "",
      });
      const pub = await newPub.save();
      const updatedPub = await Pubs.find({})
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("pubs", updatedPub);
      res.status(201).json({ message: 'Publicação criada com sucesso', pub });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar publicação.' });
    }
  });
};