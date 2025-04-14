import { Response, Request } from "express";
import { BookMark } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getAllBookMarkByBarberId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { barberId } = req.params;
    const book = await BookMark.find({ barberId })
      .populate('clientId', 'name image address')
      .populate('barberId', 'name profession image address')
      .populate('category', 'name')
      .lean();
    getIO().emit("bookByBarberId", book);
    return res.status(200).json(book);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de agendamentos." });
  }
};