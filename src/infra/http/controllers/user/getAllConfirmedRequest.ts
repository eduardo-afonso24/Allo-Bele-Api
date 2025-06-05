import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";


export const getAllConfirmedRequest = async (_: Request, res: Response) => {
  try {
    const request = await ConfirmationRequets.find({ confirmed: true })
      .populate('clientId', '_id image name phone location')
      .populate('baberId', '_id image name location').sort({ timestamp: -1 }).lean();
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao listar os pedidos (chamadas) confirmados', error);
    return res.status(500).json({ message: 'Erro ao listar os pedidos (chamadas) confirmados.' });
  }
};