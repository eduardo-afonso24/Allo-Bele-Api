import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../shared";
import { GenerateCode, SendMail } from "../../../../helpers";

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const identifier = email;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email ou telefone e senha são obrigatórios." });
    }

    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const validRoles = ["admin", "client", "barber", "company"];
    if (!validRoles.includes(user.role)) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (user.status === false) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const code = GenerateCode();
      user.verificationByEmailToken = code;
      user.verificationByEmailExpires = now;
      await user.save();

      if (user.email) {
        await notifyUserByEmail({
          token: code,
          userName: user.name,
          userEmail: user.email,
        });
      }

      return res.status(403).json({ user, message: "Usuário inativo. Verificação necessária." });
    }

    if (user.isBlocked) {
      return res.status(423).json({ message: "Usuário bloqueado!" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "alloBelleSecretKey01", // Idealmente usar variável de ambiente
      { expiresIn: "60d" }
    );

    return res.status(200).json({ user, token });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao fazer login." });
  }
};

async function notifyUserByEmail({
  userName,
  userEmail,
  token,
}: {
  userName: string;
  userEmail: string;
  token: string;
}) {
  const title = "Confirmação de e-mail";
  const titleUperCase = title.toUpperCase();
  return new SendMail().execute({
    to: userEmail ?? "",
    subject: `${titleUperCase}!`,
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
        <div style="text-align: center;">
          <img src="https://fv5-6.failiem.lv/thumb_show.php?i=b8u8ddb645&download_checksum=c7dd85e44647ef779bc4198bc0b2f32e8641f89e&download_timestamp=1742214111" style="max-width: 150px;" />
          <h1>Olá, ${userName}</h1>
        </div>
        <p>Seu código de verificação: <strong>${token}</strong></p>
        <p>Ele expira em 1 hora. Não compartilhe com ninguém.</p>
        <p>Equipe Alo Belle</p>
      </div>
    </body>
    </html>
    `,
  });
}
