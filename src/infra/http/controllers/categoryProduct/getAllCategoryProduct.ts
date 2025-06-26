import { Response, Request } from "express";
import { CategoryProduct } from "../../../../shared";

export const getAllCategoryProduct = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const category = await CategoryProduct.find()
      .sort({ timestamp: -1 })
      .lean();
    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao imprimir lista de todos as categorias de produtos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de todos as categorias de produtos." });
  }
};