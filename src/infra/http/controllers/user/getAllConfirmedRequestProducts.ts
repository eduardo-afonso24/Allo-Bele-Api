import { Response, Request } from "express";
import { RequestProducts } from "../../../../shared";


export const getAllConfirmedRequestProducts = async (_: Request, res: Response) => {
  try {
    const request = await RequestProducts.find({ confirmed: 1 })
      .populate('products.product', '_id image name price')
      .sort({ timestamp: -1 }).lean();
    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar os pedidos (chamadas) confirmados.' });
  }
};