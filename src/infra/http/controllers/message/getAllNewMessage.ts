import { Response, Request } from "express";
import { Message } from "../../../../shared";

export const getAllNewMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomId } = req.params;

    const newMessages = await Message.find({ roomId, new: true })
      .sort({ timestamp: -1 })
      .exec();

    return res.status(200).json(newMessages);
  } catch (error) {
    console.error("Erro ao imprimir lista de mensagens novas:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de mensagens novas." });
  }
};
