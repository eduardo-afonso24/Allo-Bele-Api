import { Request, Response } from "express";
import { User, Message, PushNotification } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";
import { createOrGetRoomService } from "../room";

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, username, message } = req.body;
  const io = getIO();

  if (!senderId || !receiverId || !username || !message) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes." });
  }

  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Usuário remetente não encontrado." });
    }

    // Usa o serviço para garantir que a sala existe e os dois participantes estão dentro
    const room = await createOrGetRoomService(senderId, receiverId);

    // Cria e salva a nova mensagem
    const newMessage = new Message({
      senderId,
      receiverId,
      username,
      receivername: (await User.findById(receiverId))?.name || "",
      message,
      roomId: room._id,
    });

    await newMessage.save();

    // Envia via socket
    io.to(room._id.toString()).emit("receiveMessage", newMessage);

    // Notificação push
    const pushToken = await PushNotification.findOne({ userId: receiverId });
    if (pushToken) {
      const text = message.length > 30 ? message.slice(0, 27) + "..." : message;
      const url = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(pushToken.token, "Nova mensagem", text, url);
    }

    return res.status(200).json({ message: "Mensagem enviada com sucesso", newMessage });

  } catch (error) {
    return res.status(500).json({ message: "Erro interno ao enviar mensagem", error });
  }
};
