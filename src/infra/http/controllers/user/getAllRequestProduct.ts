// getAllRequestProduct.ts
import { Response, Request } from "express";
import { RequestProducts } from "../../../../shared";

export const getAllRequestProduct = async (_: Request, res: Response) => {
  try {
    const requests = await RequestProducts.find()
      .populate('products.product', '_id image name price') // popula os produtos dentro do array
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar os pedidos.' });
  }
};
