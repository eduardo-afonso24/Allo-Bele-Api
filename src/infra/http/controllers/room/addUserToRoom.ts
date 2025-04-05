import { Response, Request } from "express";
import { Room } from "../../../../shared";
import { getIO } from "../socket/sockets";
import mongoose from "mongoose";

export const addUserToRoom = async (req: Request, res: Response) => {
  const { roomId, userId } = req.params;

  try {
    const io = getIO();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const room = await Room.findById(roomId);
    if (!room) {
      const room = new Room({
        name: roomId
      })

      await room.save();
      io.emit("roomCreated", room);

      return res.status(200).json({ message: "Sala de mensagens criada com sucesso", room });

    }

    room.participants.push(userObjectId);
    await room.save();
    io.to(roomId).emit("userJoined", { roomId, userObjectId });

    return res.status(200).json({ message: "Sala de mensagens criada com sucesso", room });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar a sala de mensagens", error });
  }
};