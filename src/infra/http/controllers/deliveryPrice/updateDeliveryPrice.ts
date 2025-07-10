import { Response, Request } from "express";
import { DeliveryPrice } from "../../../../shared";


export const updateDeliveryPrice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    const findDeliveryPrice = await DeliveryPrice.findById(id);
    if (!findDeliveryPrice) {
      return res.status(404).json({ message: "preço não encontrado" });
    }


    const deliveryPrice = await DeliveryPrice.findByIdAndUpdate(id, {
      price
    },
      { new: true })
      .lean();

    return res.status(200).json({ message: "preço editado com sucesso", deliveryPrice });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar o preço", error });
  }
};