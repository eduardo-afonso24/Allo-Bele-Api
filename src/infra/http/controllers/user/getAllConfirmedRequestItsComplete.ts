import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";

export const getAllConfirmedRequestItsComplete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const requests = await ConfirmationRequets.find({
      confirmed: true,
      isItComplete: true,
      $or: [
        { clientId: userId },
        { baberId: userId }
      ]
    })
      .populate('clientId', '_id image name email phone')
      .populate('baberId', '_id image name email')
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar os pedidos confirmados e completos.' }); // Mensagem de erro atualizada
  }
};