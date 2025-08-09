import { Response, Request } from "express";
import { User } from "../../../../shared";
import { GenerateCode, SendMail } from "../../../../helpers";


export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "User nao existe." });
    }

    const now = new Date();
    now.setHours(now.getHours() + 1);
    const code = GenerateCode();

    findUser.verificationByEmailToken = String(code);
    findUser.verificationByEmailExpires = now;

    const user = await findUser.save();
    await notifyUserByEmail({
      token: user.verificationByEmailToken,
      userName: user.name,
      userEmail: user.email,
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
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
  const title = "Recuperação de conta";
  const titleUperCase = title.toUpperCase();
  return new SendMail().execute({
    to: userEmail ?? "",
    html: `
      <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de conta</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
     <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px;">
        <img src="https://fv5-6.failiem.lv/thumb_show.php?i=b8u8ddb645&download_checksum=c7dd85e44647ef779bc4198bc0b2f32e8641f89e&download_timestamp=1742214111" alt="Logo da Empresa" style="max-width: 150px;">
        <h1 style="margin: 0; color: #333333;">Olá #${userName}</h1>
      </div>
      <div style="margin-bottom: 20px;">
          <h2 style="color: #333333; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Recuperação de conta</h2>
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