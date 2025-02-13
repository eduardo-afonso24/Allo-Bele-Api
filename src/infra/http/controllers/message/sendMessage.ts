import { Response, Request } from "express";
import { User, Message } from "../../../../shared";

export const sendMessage = async (req: Request, res: Response) => {
  // const { barberId, message, roomId } = req.body;
  const { username, message, roomId } = req.body;

  const { senderId } = req.params;

  try {
    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!message || !roomId) {
      return res.status(400).json({ message: "Os campos mensagem e o id do barbeiro são obrigatórios." });
    }

    const messages = new Message({
      // clientId,
      // barberId,
      senderId,
      username,
      message,
      roomId
    })

    await messages.save();

    res.status(200).json({ message: "Mensagem enviada com sucesso", messages });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar mensagem", error });
  }
};