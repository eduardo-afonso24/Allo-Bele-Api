import { Response, Request } from "express";
import { BookMark, PushNotification } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";


export const updateBookMark = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirmed } = req.body;

  try {
    const findBook = await BookMark.findById(id);
    if (!findBook) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    const book = await BookMark.findByIdAndUpdate(id, {
      confirmed
    },
      { new: true });

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

    res.status(200).json({ message: "Agendamento editado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar agendamento", error });
  }
};