import { Response, Request } from "express";
import { ConfirmationRequets, PushNotification, User } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const authorizedRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { authorized } = req.body;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      authorized,
      new: true
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    const updatedRequest = await ConfirmationRequets.find({})
      .populate('clientId', '_id image name email phone location')
      .populate('baberId', '_id image name email location').sort({ timestamp: -1 }).lean();

    const updateBarber = await User.findById(request?.baberId._id)

    if (updateBarber) {
      const expoToken = await PushNotification.findOne({ userId: updateBarber._id });

      if (expoToken) {
        const text = `Serviços : ${request.selectedServices.map((i) => i.serviceName).slice(0, 1)}`;
        const urlScreens = "/screens/client/(tabs)/home";
        await sendPushNotificationExpo(
          expoToken.token,
          "Novo pedido recebido",
          text,
          urlScreens
        );
      }
    }

    const userId = request.clientId._id


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
    return res.status(500).json({ message: 'Erro ao autorizar o pedido (chamada).' });
  }
};