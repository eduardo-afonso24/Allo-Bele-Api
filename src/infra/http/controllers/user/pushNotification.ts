import { Response, Request } from "express";
import { PushNotification, User } from "../../../../shared";


export const pushNotification = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { token } = req.body;
  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const expoToken = await PushNotification.findOne({ userId: userId });
    if (expoToken) {
      const request = await PushNotification.findByIdAndUpdate(expoToken._id, {
        token: token
      },
        { new: true });

      return res.status(200).json(request);
    }

    const request = new PushNotification({
      userId,
      token
    });

    await request.save();

    return res.status(200).json(request);

  } catch (error) {
    console.error('Erro ao gravar o expo token', error);
    return res.status(500).json({ message: 'Erro ao gravar o expo token.' });
  }
};