import { Response, Request } from "express";
import { DeliveryPrice } from "../../../../shared";

export const getOneDeliveryPrice = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const deliveryPrice = await DeliveryPrice.findOne()
      .lean();
    return res.status(200).json(deliveryPrice);
  } catch (error) {
    console.error("Erro ao imprimir o preço de entrega", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir o preço de entrega" });
  }
};