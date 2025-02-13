
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const getAllbarber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const barberList = await User.find({ role: "barber" });
    return res.status(200).json(barberList);
  } catch (error) {
    console.error("Erro ao imprimir lista de barbeiros:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de barbeiros." });
  }
};