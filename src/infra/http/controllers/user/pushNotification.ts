import { Response, Request } from "express";
import { PushNotification, User } from "../../../../shared";


export const pushNotification = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { token } = req.body;
  try {
    console.log({token, userId})
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const expoToken = await PushNotification.findOne({ userId: userId });
    console.log("PUSH NOTIFICATIONS :", expoToken)
    if (expoToken) {
      const request = await PushNotification.findByIdAndUpdate(expoToken._id, {
        token: token
      },
        { new: true });

        console.log("DENTRO do if :", request)

      return res.status(200).json(request);
    }

    const request = new PushNotification({
      userId,
      token
    });

    await request.save();
     console.log("Fora do if :", request)

    return res.status(200).json(request);

  } catch (error) {
    console.error('Erro ao gravar o expo token', error);
    return res.status(500).json({ message: 'Erro ao gravar o expo token.' });
  }
};