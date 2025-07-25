import { Response, Request } from "express";
import { Products } from "../../../../shared";

export const updateProductDiscount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { discount } = req.body;

  try {
    const findProduct = await Products.findById(id);
    if (!findProduct) {
      return res.status(404).json({ message: "preço não encontrado" });
    }

    const product = await Products.findByIdAndUpdate(
      id,
      {
        discount,
      },
      { new: true }
    ).lean();

    return res
      .status(200)
      .json({ message: "desconto editado com sucesso", product });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar o desconto", error });
  }
};
