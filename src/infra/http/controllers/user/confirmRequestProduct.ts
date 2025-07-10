import { Response, Request } from "express";
import { PushNotification, RequestProducts, User } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const confirmRequestProduct = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { confirmed, userId } = req.body;
  try {

    const findRequest = await RequestProducts.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    const request = await RequestProducts.findByIdAndUpdate(requestId, {
      confirmed,
      isUnread: true
    },
      { new: true })


    const updatedRequest = await RequestProducts.find({}).sort({ timestamp: -1 }).populate('products.product', '_id image name price').lean();

    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = confirmed === 1 ? "A sua encomenda está a caminho!" : confirmed === 2 && "A Encomenda foi recusada!";
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Atualização da encomenda",
        text,
        urlScreens
      );
    }


    const requestByUserId = await RequestProducts.find({
      confirmed: true,
      $or: [
        { clientId: userId },
        { baberId: userId }
      ]
    })
      .populate('products.product', '_id image name price')
      .sort({ timestamp: -1 })
      .lean();

    getIO().emit("requestProductsByUserId", requestByUserId);
    getIO().emit("requestProducts", updatedRequest);
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao confirmar a encomenda', error);
    return res.status(500).json({ message: 'Erro ao confirmar a encomenda.' });
  }
};