import { Response, Request } from "express";
import { ConfirmationRequets, PushNotification, User } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const confirmRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { confirmed } = req.body;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      confirmed,
      new: true
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    const updatedRequest = await ConfirmationRequets.find({})
      .populate('clientId', '_id image name email phone location')
      .populate('baberId', '_id image name email location').sort({ timestamp: -1 }).lean();

    await User.findByIdAndUpdate(request?.baberId._id, {
      occupied: confirmed
    },
      { new: true });

    const userId = request.clientId._id
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = confirmed && request?.authorized === true ? "Pedido confirmado" : !confirmed && request?.authorized === true && "Pedido recusado";
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Atualização do pedido",
        text,
        urlScreens
      );
    }


    const requestByUserId = await ConfirmationRequets.find({
      confirmed: true,
      $or: [
        { clientId: userId },
        { baberId: userId }
      ]
    })
      .populate('clientId', '_id image name email phone')
      .populate('baberId', '_id image name email')
      .sort({ timestamp: -1 })
      .lean();

    getIO().emit("requestByUserId", requestByUserId);
    getIO().emit("request", updatedRequest);
    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao confirmar o pedido (chamada).' });
  }
};