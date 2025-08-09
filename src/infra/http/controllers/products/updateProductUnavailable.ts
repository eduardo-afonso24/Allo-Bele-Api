import { Response, Request } from "express";
import { Products } from "../../../../shared";

export const updateProductUnavailable = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { discount, promotion } = req.body;

  const discountToNumber = Number(discount);
  const shouldApplyPromotion = promotion === true || promotion === "true";
  const isValidDiscount = discountToNumber > 0 && discountToNumber < 100;

  try {
    const findProduct = await Products.findById(id);
    if (!findProduct) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    if (shouldApplyPromotion && !isValidDiscount) {
      return res.status(400).json({ message: "Desconto deve estar entre 1% e 99%." });
    }

    const discountedPrice = shouldApplyPromotion
      ? Math.round(findProduct.price * (1 - discountToNumber / 100))
      : 0;

    const product = await Products.findByIdAndUpdate(
      id,
      {
        discount: shouldApplyPromotion ? discountToNumber : 0,
        discountedPrice,
        promotion: shouldApplyPromotion,
      },
      { new: true }
    ).lean();

    console.log({ product: product })

    return res
      .status(200)
      .json({ message: "Desconto atualizado com sucesso.", product });
  } catch (error) {
    console.error("Erro ao aplicar desconto:", error);
    res.status(500).json({ message: "Erro interno ao aplicar desconto.", error });
  }
};
