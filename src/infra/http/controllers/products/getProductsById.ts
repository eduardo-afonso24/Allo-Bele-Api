import { Response, Request } from "express";
import { Products } from "../../../../shared";

export const getProductsById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id)
      .populate("category", "_id name")
      .populate("brand", "_id name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao buscar o produto." });
  }
};
