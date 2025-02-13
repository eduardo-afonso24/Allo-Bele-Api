
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const getAllClients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clientsList = await User.find({ role: "client" });
    return res.status(200).json(clientsList);
  } catch (error) {
    console.error("Erro ao imprimir lista de clientes:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de clientes." });
  }
};