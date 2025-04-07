import { Response, Request } from "express";
import { ConfirmationRequets, PushNotification } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const deleteRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId)
      .populate("clientId", "_id image email")
      .populate("baberId", "_id image email");
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndDelete(requestId)

    getIO().emit("confirmRequests", findRequest);
    const userId = findRequest.clientId._id
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = "Pedido cancelado";
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
    console.error('Erro ao cancelar o pedido (chamada)', error);
    return res.status(500).json({ message: 'Erro ao cancelar o pedido (chamada).' });
  }
};