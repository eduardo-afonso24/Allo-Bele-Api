import { Response, Request } from "express";
import { Products } from "../../../../shared";

export const updateProductUnavailable = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { unavailable } = req.body;

  const unavailableToBoolean = Boolean(unavailable);

  try {
    const findProduct = await Products.findById(id);
    if (!findProduct) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const product = await Products.findByIdAndUpdate(
      id,
      {
        unavailable: unavailableToBoolean,
      },
      { new: true }
    ).lean();

    return res
      .status(200)
      .json({ message: "Status do pedido atualizado com sucesso.", product });
  } catch (error) {
    res.status(500).json({ message: "Erro interno ao aplicar status do pedido.", error });
  }
};
