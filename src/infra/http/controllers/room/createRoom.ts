import { Request, Response } from 'express';
import { createOrGetRoomService } from './room.service';

export const createOrGetRoomController = async (req: Request, res: Response) => {
  try {
    const { userId, receiverId } = req.body;

    if (!userId || !receiverId) {
      return res.status(400).json({ error: "userId and receiverId are required" });
    }

    const room = await createOrGetRoomService(userId, receiverId);
    return res.status(200).json(room);
  } catch (error) {
    console.error("Erro ao criar ou obter sala:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
