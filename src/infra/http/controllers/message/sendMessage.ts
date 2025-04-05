import { Response, Request } from "express";
import { User, Message, Room, PushNotification } from "../../../../shared";
import { getIO } from "../socket/sockets";
import mongoose from "mongoose";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";

export const sendMessage = async (req: Request, res: Response) => {
  const { username, message, roomId, senderId } = req.body;
  // const { senderId } = req.params;
  const io = getIO();

  try {
    if (!message || !roomId) {
      return res.status(400).json({ message: "Os campos mensagem e o id do barbeiro são obrigatórios." });
    }

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const userObjectId = new mongoose.Types.ObjectId(senderId);

    let room = await Room.findById(roomId);
    if (!room) {
      room = new Room({
        _id: roomId,
        name: roomId,
        participants: [userObjectId],
      });

      await room.save();

      const newMessage = new Message({
        senderId,
        username,
        message,
        roomId
      });

      await newMessage.save();
      io.emit("roomCreated", room);
      io.to(roomId).emit("receiveMessage", newMessage);

      const expoToken = await PushNotification.findOne({ userId: senderId });

      if (expoToken) {
        const text = message.substring(0, 10);
        const urlScreens = "/screens/client/(tabs)/home";
        await sendPushNotificationExpo(
          expoToken.token,
          "Nova mensagem recebida",
          text,
          urlScreens
        );
      }

      return res.status(200).json({ message: "Mensagem enviada com sucesso", newMessage });
    }

    // Garante que o usuário está na lista de participantes (sem duplicatas)
    if (!room.participants.includes(userObjectId)) {
      room.participants.push(userObjectId);
      await room.save();
    }

    const newMessage = new Message({
      senderId,
      username,
      message,
      roomId
    });

    await newMessage.save();
    io.to(roomId).emit("receiveMessage", newMessage);

    res.status(200).json({ message: "Mensagem enviada com sucesso", newMessage });

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ message: "Erro ao enviar mensagem", error });
  }
};

