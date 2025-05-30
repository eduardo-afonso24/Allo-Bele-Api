import { Response, Request } from "express";
import { ConfirmationRequets, PushNotification, User } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const isItCompleteRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { isItComplete } = req.body;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      isItComplete,
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    const barberId = request.baberId._id
    const userId = request.clientId._id
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = isItComplete ? "Pedido concluido" : "Pedido não conluido";
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Atualização do pedido",
        text,
        urlScreens
      );
    }

    const findBarber = await User.findById(barberId);
    if (findBarber && isItComplete) {
      console.log({ isItComplete: isItComplete })
      const barber = await User.findByIdAndUpdate(barberId, {
        occupied: false
      },
        { new: true });

      console.log({ barber: barber })
    }

    const updatedRequest = await ConfirmationRequets.find({})
      .populate('clientId', '_id image name email phone location')
      .populate('baberId', '_id image name email location').sort({ timestamp: -1 }).lean();
    getIO().emit("request", updatedRequest);
    getIO().emit("confirmRequests", request);
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao confirmar o pedido (chamada) como concluido', error);
    return res.status(500).json({ message: 'Erro ao confirmar o pedido (chamada) como concluido.' });
  }
};