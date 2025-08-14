import { Response, Request } from "express";
import { Products } from "../../../../shared";

export const getProductsAllIsWholesale = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const products = await Products.find({ isWholesale: true })
      .populate('category', '_id name')
      .populate('brand', '_id name')
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de produtos." });
  }
};
