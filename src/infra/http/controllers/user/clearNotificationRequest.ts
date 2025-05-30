import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const clearNotificationRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      new: false
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    const updatedRequest = await ConfirmationRequets.find({})
      .populate('clientId', '_id image name email phone location')
      .populate('baberId', '_id image name email location').sort({ timestamp: -1 }).lean();
    getIO().emit("request", updatedRequest);
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao marcar o pedido (chamada) como antigo', error);
    return res.status(500).json({ message: 'Erro ao marcar o pedido (chamada) como antigo.' });
  }
};