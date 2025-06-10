// getAllRoom.ts
import { Response, Request } from "express";
import { Room } from "../../../../shared";

export const getAllRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const room = await Room.find().populate("participants").lean();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Erro ao imprimir lista de salas:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de salas." });
  }
};