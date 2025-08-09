import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";

export const getAllRequest = async (_: Request, res: Response) => {
  try {
    const request = await ConfirmationRequets.find()
      .populate('clientId', '_id image name phone')
      .populate('baberId', '_id image name').sort({ timestamp: -1 }).lean();

    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar os pedidos (chamadas).' });
  }
};