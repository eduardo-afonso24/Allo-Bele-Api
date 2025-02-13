import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const register = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;

    if (!file || !file.filepath) {
      console.error('Nenhum arquivo enviado ou arquivo inválido');
      return res.status(400).json({ message: 'Nenhum arquivo enviado ou arquivo inválido.' });
    }

    const avatarUrl = `/uploads/${path.basename(file.filepath)}`;

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    const profession = Array.isArray(fields.profession) ? fields.profession[0] : fields.profession;

    console.log({ name, email, phone, password, address, gender, profession })
    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    console.log({ name, email, phone, password, address, gender })

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já está em uso." });
      }

      let hashedPassword = ''
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        address,
        gender,
        image: avatarUrl,
        profession,
        role: profession.trim() !== '' ? "barber" : "client"
        //   avatar: [avatarUrl],
      });

      await newUser.save();

      return res.status(201).json({ message: "Usuário registrado com sucesso.", newUser });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).json({ message: "Ocorreu um erro ao registrar o usuário." });
    }
  });
};