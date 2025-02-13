
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao imprimir informacoes do usuario:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir informacoes do usuario." });
  }
};