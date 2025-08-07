import { Response, Request } from "express";
import { Promotions } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getPromotions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const promotions = await Promotions.find({}).sort({ timestamp: -1 }).lean();
    return res.status(200).json(promotions);
  } catch (error) {
    console.error("Erro ao imprimir lista de promoções:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de promoções." });
  }
};
