import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../shared";


export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

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