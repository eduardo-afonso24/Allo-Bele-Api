import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../../shared";
import { GenerateCode, SendMail } from "../../../../helpers";

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
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    const profession = Array.isArray(fields.profession) ? fields.profession[0] : fields.profession;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Telefone já está em uso." });
      }

      let hashedPassword = ''
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const now = new Date();
      now.setHours(now.getHours() + 1);
      const code = GenerateCode();


      const user = new User({
        name,
        phone,
        password: hashedPassword,
        verificationByEmailToken: code,
        verificationByEmailExpires: now,
        gender,
        image: avatarUrl,
        profession,
        role: profession.trim() !== '' ? "barber" : "client"
      });

      await user.save();
      await notifyUserByEmail({
        token: user.verificationByEmailToken,
        userName: user.name,
        userEmail: user.email,
      });

      console.log({
        verificationByEmailToken: user.verificationByEmailToken,
        userName: user.name,
        userEmail: user.email,
      })

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

async function notifyUserByEmail({
  userName,
  userEmail,
  token
}: {
  userName: string;
  userEmail: string;
  token: string
}) {
  const title = "Confirmação de e-mail";
  const titleUperCase = title.toUpperCase();
  return new SendMail().execute({
    to: userEmail ?? "",
    html: `
      <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de e-mail</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
     <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px;">
        <img src="https://fv5-6.failiem.lv/thumb_show.php?i=b8u8ddb645&download_checksum=c7dd85e44647ef779bc4198bc0b2f32e8641f89e&download_timestamp=1742214111" alt="Logo da Empresa" style="max-width: 150px;">
        <h1 style="margin: 0; color: #333333;">Olá #${userName}</h1>
      </div>
      <div style="margin-bottom: 20px;">
          <h2 style="color: #333333; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Validação de e-mail</h2>
          <p style="margin: 5px 0; color: #666666;"><strong>Olá Sr(a). ${userName}, estamos entrando em contacto para confirmar o seu email.</p>
          <p style="margin: 5px 0; color: #666666;">Insira o seguinte código no nosso app <strong>${token}</strong>, não partilhar com terceiros. Essa é uma medida importante para garantir a segurança da sua conta e garantir que você tenha acesso total a todas as funcionalidades que oferecemos.</p>
          <p style="margin: 5px 0; color: #666666;"><strong>${userName}, o código expira em uma hora.</p>
      </div>
      <div style="text-align: center; color: #999999; font-size: 12px;">
          <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} Alo Belle. Todos os direitos reservados.</p>
          <p style="margin: 5px 0;">Se você tem alguma dúvida, entre em contato conosco.</p>
      </div>
  </div>
</body>
</html>

    `,
    subject: `${titleUperCase}!`,
  });
}