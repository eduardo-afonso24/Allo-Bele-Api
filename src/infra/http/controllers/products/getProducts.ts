import { Response, Request } from "express";
import { Products } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const products = await Products.find({})
      .populate('category', '_id name')
      .populate('brand', '_id name')
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("products", products);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao imprimir lista de produtos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de produtos." });
  }
};