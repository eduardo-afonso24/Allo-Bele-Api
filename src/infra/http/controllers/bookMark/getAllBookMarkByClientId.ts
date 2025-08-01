
import { Response, Request } from "express";
import { BookMark } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getAllBookMarkByClientId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId } = req.params;
    const book = await BookMark.find({ clientId })
      .populate('clientId', 'name image address')
      .populate('barberId', 'name profession image address')
      .populate('category', 'name')
      .lean();
    getIO().emit("bookByClientId", book);
    return res.status(200).json(book);
  } catch (error) {
    console.error("Erro ao imprimir lista de agendamentos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de agendamentos." });
  }
};