import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../shared";
import { GenerateCode, SendMail } from "../../../../helpers";


export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    console.log({ email, password })

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User nao existe." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    let role: string;
    if (
      user.role === "admin" ||
      user.role === "client" ||
      user.role === "barber" ||
      user.role === "company"
    ) {
      role = user.role;
    } else {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (user.status === false) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const code = GenerateCode();
      user.verificationByEmailToken = code,
        user.verificationByEmailExpires = now,
        await user.save();
      await notifyUserByEmail({
        token: user.verificationByEmailToken,
        userName: user.name,
        userEmail: user.email,
      });

      return res.status(403).json({ user });

    }

    if (user.isBlocked === true) {
      return res.status(423).json({ message: "Usuario bloqueado!" });
    }

    // Gera o token de autenticação
    const token = jwt.sign({ userId: user._id, role }, "alloBelleSecretKey01", {
      expiresIn: "60d",
    });

    // Retorna o usuário e o token de autenticação
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao fazer login." });
  }
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