import { Response, Request } from "express";
import { DeliveryPrice } from "../../../../shared";

export const registerDeliveryPrice = async (req: Request, res: Response) => {
  const { price } = req.body;

  try {

    if (!price) {
      return res.status(400).json({ message: "o preço é obrigatório." });
    }

    const deliveryPrice = new DeliveryPrice({
      price
    })

    await deliveryPrice.save();

    res.status(200).json({ message: "preço adicionado com sucesso", deliveryPrice });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar a preço", error });
  }
};