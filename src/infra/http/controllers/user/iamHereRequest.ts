import { Response, Request } from "express";
import { ConfirmationRequets, PushNotification } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const iamHereRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { iamHere } = req.body;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      iamHere,
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    getIO().emit("confirmRequests", request);
    const userId = request.clientId._id
    const barberName = request.baberName
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = iamHere ? `O professional ${barberName} já chegou!` : `O professional ${barberName} está a caminho!`;
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Atualização do pedido",
        text,
        urlScreens
      );
    }
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao confirmar a chegada o pedido (chamada)', error);
    return res.status(500).json({ message: 'Erro ao confirmar a chegada o pedido (chamada).' });
  }
};