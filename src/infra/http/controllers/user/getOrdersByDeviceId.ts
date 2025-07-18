import { Response, Request } from "express";
import { RequestProducts } from "../../../../shared";

export const getOrdersByDeviceId = async (req: Request, res: Response): Promise<Response> => {
 try {
 const { deviceId } = req.params;

 if (!deviceId) {
 return res.status(400).json({ message: 'ID do dispositivo não fornecido.' });
 }

 const orders = await RequestProducts.find({ deviceId: deviceId }).populate('products.product', '_id image name price') // popula os produtos dentro do array
      .sort({ timestamp: -1 })
      .lean();

 return res.status(200).json(orders);

 } catch (error) {
 console.error('Erro ao buscar pedidos:', error);
 return res.status(500).json({ message: 'Erro interno ao buscar pedidos.' });
 }
};