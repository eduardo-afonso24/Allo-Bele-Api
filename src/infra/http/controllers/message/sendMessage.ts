import { Response, Request } from "express";
import { User, Message } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const sendMessage = async (req: Request, res: Response) => {
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

    const newMessage = new Message({
      senderId,
      username,
      message,
      roomId
    });

    await newMessage.save();

    // 🔥 Emitir evento de nova mensagem para todos na sala
    const io = getIO(); // Obtém a instância do Socket.IO
    io.to(roomId).emit("receiveMessage", newMessage); // Envia a nova mensagem para os clientes na sala

    res.status(200).json({ message: "Mensagem enviada com sucesso", newMessage });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ message: "Erro ao enviar mensagem", error });
  }
};
