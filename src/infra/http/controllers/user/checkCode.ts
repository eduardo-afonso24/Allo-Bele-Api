import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const checkCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, verificationByEmailToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User nao existe." });
    }

    if (
      user.verificationByEmailToken !== verificationByEmailToken
    ) {
      return res.status(403).json({ message: "Codigo invalido." });
    }

    const now = new Date();
    if (now > user.verificationByEmailExpires) {
      return res.status(401).json({ message: "Codigo expirado." });
    }
    user.status = true;
    await user.save();
    const role = user?.role
    // Gera o token de autenticação
    const token = jwt.sign({ userId: user._id, role }, "alloBelleSecretKey01", {
      expiresIn: "60d",
    });

    // Retorna o usuário e o token de autenticação
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
  }
};