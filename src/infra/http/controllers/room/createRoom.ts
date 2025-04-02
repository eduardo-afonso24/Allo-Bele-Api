import { Response, Request } from "express";
import { Room } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const createRoom = async (req: Request, res: Response) => {
  const { name } = req.body;


  try {

    if (!name) {
      return res.status(400).json({ message: "Os campos mensagem e o id do barbeiro são obrigatórios." });
    }

    const room = new Room({
      name
    })

    await room.save();
    const io = getIO();
    io.emit("roomCreated", room);

    res.status(200).json({ message: "Sala de mensagens criada com sucesso", room });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar a sala de mensagens", error });
  }
};