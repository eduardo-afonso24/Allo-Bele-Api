import { Response, Request } from "express";
import { Promotions } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const deletePromotions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findPromotions = await Promotions.findById(id);
    if (!findPromotions) {
      return res.status(404).json({ message: "Promoção não encontrada" });
    }

    await Promotions.findByIdAndDelete(id);
    const promotions = await Promotions.find({}).sort({ timestamp: -1 }).lean();
    getIO().emit("promotions", promotions);

    res.status(200).json({ message: "Promoção removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover Promoção", error });
  }
};
