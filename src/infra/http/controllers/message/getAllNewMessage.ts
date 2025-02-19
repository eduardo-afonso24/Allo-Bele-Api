import { Response, Request } from "express";
import { Message } from "../../../../shared";

export const getAllNewMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId });
    const newMessages = messages.filter(msg => msg.new === true);
    const sortedMessages = newMessages.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return res.status(200).json(sortedMessages);
  } catch (error) {
    console.error("Erro ao imprimir lista de mensagens novas:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de mensagens novas." });
  }
};
