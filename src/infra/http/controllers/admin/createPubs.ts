import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Pubs } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


export const createPubs = async (req: Request, res: Response) => {
    const form = new IncomingForm({ uploadDir, keepExtensions: true});
  
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Erro ao fazer upload do arquivo', err);
        return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
      }
  
      console.log('Fields:', fields);
      console.log('Files:', files);
  
      const file = Array.isArray(files.image) ? files.image[0] : files.image;   
      if (!file || !file.filepath) {
        console.error('Nenhum arquivo enviado ou arquivo inválido');
        return res.status(400).json({ message: 'Nenhum arquivo enviado ou arquivo inválido.'});
      }
      const imagensUrl = `/uploads/${path.basename(file.filepath)}`;
      console.log('caminho da imgem ',imagensUrl)
      const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
      try {
        const newPub = new Pubs({
          message,
          image: imagensUrl ? imagensUrl : "",
        });
        const pub = await newPub.save();
        res.status(201).json({ message: 'Publicação criada com sucesso', pub });
      } catch (error) {
        console.error('Erro ao criar publicação', error);
        res.status(500).json({ message: 'Erro ao criar publicação.' });
      }
    });
  };