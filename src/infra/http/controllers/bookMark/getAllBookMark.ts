import { Response, Request } from "express";
import { BookMark } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getAllBookMark = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const book = await BookMark.find()
      .populate('clientId', 'name address')
      .populate('barberId', 'name address').sort({ createdAt: -1 });
    getIO().emit("getAllBook", book);
    return res.status(200).json(book);
  } catch (error) {
    console.error("Erro ao imprimir lista de todos os agendamentos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de todos os agendamentos." });
  }
};