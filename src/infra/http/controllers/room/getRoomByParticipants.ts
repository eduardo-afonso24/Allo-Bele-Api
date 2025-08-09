import { Response, Request } from "express";
import { Room, Message } from "../../../../shared";

export const getRoomByParticipants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId é obrigatório" });
    }

    // Busca as salas onde o usuário é um dos participantes
    const rooms = await Room.find({ participants: { $in: [userId] } })
      .populate("participants")  // Popula os dados dos participantes
      .lean();

    // Para cada sala, vamos buscar a última mensagem
    for (let room of rooms) {
      const lastMessage = await Message.findOne({ roomId: room._id })
        .sort({ timestamp: -1 })  // Ordena para pegar a última mensagem
        .lean();

      // Adiciona a última mensagem ao objeto da sala usando type assertion
      (room as any).lastMessage = lastMessage;
    }

    return res.status(200).json(rooms);  // Retorna as salas com a última mensagem
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao buscar salas por id do participante." });
  }
};
