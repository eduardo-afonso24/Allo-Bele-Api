
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const getAllClients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clientsList = await User.find({ role: "client" }).lean();
    return res.status(200).json(clientsList);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de clientes." });
  }
};