import { Response, Request } from "express";
import { BookMark, Category, PushNotification, User } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";
import { getIO } from "../socket/sockets";


export const updateBookMark = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirmed, barberId } = req.body;

  try {
    const findBook = await BookMark.findById(id);
    if (!findBook) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    if (confirmed === 2) {
      const book = await BookMark.findByIdAndUpdate(id, {
        confirmed
      },
        { new: true })
        .populate("clientId", "_id image email")

      const userId = book.clientId._id
      const expoToken = await PushNotification.findOne({ userId: userId });

      if (expoToken) {
        const text = confirmed == 1 ? "Agendamento confirmado" : "Agendamento recusado";
        const urlScreens = "/screens/client/(tabs)/home";
        await sendPushNotificationExpo(
          expoToken.token,
          "Atualização do agendamento",
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

      return res.status(200).json({ message: "Agendamento editado com sucesso", book });
    }

    const findBarber = await User.findById(barberId);
    if (!findBarber) {
      return res.status(404).json({ message: "Professional não encontrado" });
    }

    const book = await BookMark.findByIdAndUpdate(id, {
      confirmed,
      barberId
    },
      { new: true })
      .populate("clientId", "_id image email")
      .populate("barberId", "_id image email");

    const updateBarber = await User.findByIdAndUpdate(barberId, {
      occupied: confirmed === 1 ? true : false
    },
      { new: true });

    if (updateBarber) {
      const expoToken = await PushNotification.findOne({ userId: updateBarber._id });
      const category = await Category.findById(book.category?._id);

      if (expoToken) {
        const text = `Serviço agendado : ${category?.name}`;
        const urlScreens = "/screens/client/(tabs)/home";
        const title = confirmed == 1 ? "Agendamento confirmado" : "Agendamento recusado";
        await sendPushNotificationExpo(
          expoToken.token,
          title,
          text,
          urlScreens
        );
      }
    }

    const userId = book.clientId._id
    const expoToken = await PushNotification.findOne({ userId: userId });

    if (expoToken) {
      const text = confirmed == 1 ? "Agendamento confirmado" : "Agendamento recusado";
      const urlScreens = "/screens/client/(tabs)/home";
      await sendPushNotificationExpo(
        expoToken.token,
        "Atualização do agendamento",
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
    const bookByBarberId = await BookMark.find({ barberId })
      .populate('clientId', 'name image address')
      .populate('barberId', 'name profession image address')
      .populate('category', 'name')
      .lean();
    getIO().emit("getAllBook", updatedBook);
    getIO().emit("bookByClientId", bookByClientId);
    getIO().emit("bookByBarberId", bookByBarberId);

    return res.status(200).json({ message: "Agendamento editado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar agendamento", error });
  }
};