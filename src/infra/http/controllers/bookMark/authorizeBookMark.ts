import { Response, Request } from "express";
import { BookMark, Category, PushNotification, User } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";
import { getIO } from "../socket/sockets";


export const authorizeBookMark = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { authorized } = req.body;

  try {
    const findBook = await BookMark.findById(id);
    if (!findBook) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    // if (authorized === 2) {
    const book = await BookMark.findByIdAndUpdate(id, {
      authorized
    },
      { new: true })
      .populate("barberId", "_id image email")

    const userId = book.barberId._id
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = authorized === 1 ? "Agendamento recebido" : authorized === 2 && "Agendamento cancelado";
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Novo agendamento",
        text,
        urlScreens
      );
    }

    const updatedBook = await BookMark.find()
      .populate('clientId', 'name address')
      .populate('barberId', 'name address')
      .populate('category', 'name')
      .sort({ timestamp: -1 })
      .lean();
    const bookByClientId = await BookMark.find({ clientId: userId })
      .populate('clientId', 'name image address')
      .populate('barberId', 'name profession image address')
      .lean();
    getIO().emit("getAllBook", updatedBook);
    getIO().emit("bookByClientId", bookByClientId);

    return res.status(200).json({ message: "Agendamento autorizado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar agendamento", error });
  }
};