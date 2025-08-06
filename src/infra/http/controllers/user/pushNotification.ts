import { Response, Request } from "express";
import { PushNotification, User } from "../../../../shared";


export const pushNotification = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { token, isActive } = req.body;
  console.log("pushNotification")
  try {
    console.log({ token, userId })
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const expoToken = await PushNotification.findOne({ userId: userId });
    console.log("PUSH NOTIFICATIONS :", expoToken)
    if (expoToken && Number(isActive) === 0) {
      const request = await PushNotification.findByIdAndDelete(expoToken._id);

      console.log("Dentro do if das push notifications :", request)

      return res.status(200).json(request);
    }

    const request = new PushNotification({
      userId,
      token,
      isActive
    });

    await request.save();
    console.log("Fora do if :", request)

    return res.status(200).json(request);

  } catch (error) {
    console.error('Erro ao gravar o expo token', error);
    return res.status(500).json({ message: 'Erro ao gravar o expo token.' });
  }
};