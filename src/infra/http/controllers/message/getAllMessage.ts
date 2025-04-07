import { Response, Request } from "express";
import { Message } from "../../../../shared";


export const getAllMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomId } = req.params;
    const message = await Message.find({ roomId })
      .populate("senderId", "_id name email image")
      .populate("receiverId", "_id name email image")
      .lean();
    return res.status(200).json(message);
  } catch (error) {
    console.error("Erro ao imprimir lista de mensagens:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de mensagens." });
  }
};