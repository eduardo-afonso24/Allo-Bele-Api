import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { ConfirmationRequets, User } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const sendRequestToAdmin = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error('Erro ao fazer upload do arquivo', err);
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    console.log('Fields:', fields);
    console.log('Files:', files);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      console.error('Nenhum arquivo enviado ou arquivo inválido');
      return res.status(400).json({ message: 'Nenhum arquivo enviado ou arquivo inválido.' });
    }

    const pdfUrl = `/uploads/${path.basename(file.filepath)}`;

    const clientId = Array.isArray(fields.clientId) ? fields.clientId[0] : fields.clientId;
    const baberId = Array.isArray(fields.baberId) ? fields.baberId[0] : fields.baberId;
    const selectedServices = Array.isArray(fields.selectedServices) ? JSON.parse(fields.selectedServices[0]) : [];
    const totalPrice = Array.isArray(fields.totalPrice) ? parseFloat(fields.totalPrice[0]) : 0;

    try {
      const baber = await User.findById(baberId);
      const client = await User.findById(clientId);

      console.log(" BURLA ORGANIZADA : ", client, baber)
      if (!client || !baber) {
        return res.status(404).json({ message: 'Cliente ou Barbearia não encontrados.' });
      }

      if (!Array.isArray(selectedServices)) {
        console.log("selectedServices deve ser um array.")
        return res.status(400).json({ message: 'selectedServices deve ser um array.' });
      }


      const NewRequest = new ConfirmationRequets({
        clientId,
        clientName: client.name,
        baberId,
        baberName: baber.name,
        selectedServices,
        totalPrice,
        file: pdfUrl,
      });

      await NewRequest.save();
      res.status(200).json({ message: 'Os dados foram enviados com sucesso', NewRequest });
    } catch (error) {
      console.error('Erro ao enviar request', error);
      return res.status(500).json({ message: 'Erro ao enviar request.' });
    }
  });
};