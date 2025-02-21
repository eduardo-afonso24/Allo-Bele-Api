import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
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

    let avatarUrl = ""

    if (file && file.filepath) {
      avatarUrl = `/uploads/${path.basename(file.filepath)}`;
    }


    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    // const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    const profession = Array.isArray(fields.profession) ? fields.profession[0] : fields.profession;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já está em uso." });
      }

      let hashedPassword = ''
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        // address,
        gender,
        image: avatarUrl,
        profession,
        role: profession.trim() !== '' ? "barber" : "client"
      });

      await user.save();
      
      const token = jwt.sign({ userId: user._id, role: user.role }, "alloBelleSecretKey01", {
        expiresIn: "60d",
      });

      return res.status(201).json({ user, token });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).json({ message: "Ocorreu um erro ao registrar o usuário." });
    }
  });
};