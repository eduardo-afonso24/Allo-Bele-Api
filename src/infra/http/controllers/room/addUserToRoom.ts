import { Response, Request } from "express";
import { Room } from "../../../../shared";

export const addUserToRoom = async (req: Request, res: Response) => {
  const { roomId, userId } = req.params;

  try {

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({ message: "Sala não encontrada." });

    }
    room.participants.push(userId);
    await room.save();


    res.status(200).json({ message: "Sala de mensagens criada com sucesso", room });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar a sala de mensagens", error });
  }
};