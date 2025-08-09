import { Response, Request } from "express";
import { CategoryProduct, Products } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { category } = req.params;

    const findCategory = await CategoryProduct.findById(category);

    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }


    // Buscar todos os produtos que correspondem à categoria
    const products = await Products.find({ category: category })
      .populate('category', '_id name')
      .populate('brand', '_id name')
      .lean();

    getIO().emit("productByCategory", products);

    // Retorna os produtos filtrados
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de produtos." });
  }
};
