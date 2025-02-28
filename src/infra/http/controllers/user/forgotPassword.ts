import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    console.log({ email })

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(401).json({ message: "User nao existe." });
    }

    // Gera o token de recuperação
    const role = findUser?.role
    const token = jwt.sign({ userId: findUser._id, role }, "alloBelleSecretKey01", {
      expiresIn: "1d",
    });

    findUser.token = String(token);

    const user = await findUser.save();

    // Retorna o usuário e o token de recuperação
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Erro no forgot password :", error);
    return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
  }
};