import { Response, Request } from "express";
import { PushNotification, User } from "../../../../shared";

export const pushNotification = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { token, isActive } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const expoToken = await PushNotification.findOne({ userId: userId });
    if (expoToken && Number(isActive) === 0) {
      const request = await PushNotification.findByIdAndDelete(expoToken._id);

      return res.status(200).json(request);
    }

    if (expoToken && Number(isActive) !== 0) {
      const request = await PushNotification.findByIdAndUpdate(
        expoToken._id,
        {
          token: token,
          isActive: 1,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(request);
    }

    const request = new PushNotification({
      userId,
      token,
      isActive,
    });

    await request.save();

    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao gravar o expo token." });
  }
};
