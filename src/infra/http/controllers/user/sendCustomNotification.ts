// controllers/notifications/sendCustomNotification.ts
import { Request, Response } from "express";
import { PushNotification, User } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";

export const sendCustomNotification = async (req: Request, res: Response) => {
  const { title, body, url, userId, sendToAll } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Título e corpo da notificação são obrigatórios." });
  }

  try {
    let tokens: string[] = [];

    if (sendToAll) {
      // Enviar para todos os usuários que têm token registrado
      const allTokens = await PushNotification.find({});
      tokens = allTokens.map((t) => t.token);
    } else if (userId) {
      // Enviar para um usuário específico
      const userToken = await PushNotification.findOne({ userId });
      console.log({userToken})
      if (!userToken) {
        return res.status(404).json({ message: "Token de notificação não encontrado para este usuário." });
      }
      tokens.push(userToken.token);
    } else {
      return res.status(400).json({ message: "Informe um userId ou defina sendToAll como true." });
    }

    // Envia notificação para todos os tokens coletados
    for (const token of tokens) {
      await sendPushNotificationExpo(token, title, body, url || "/");
    }

    return res.status(200).json({ message: "Notificação(ões) enviada(s) com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar notificação personalizada:", error);
    return res.status(500).json({ message: "Erro ao enviar notificação." });
  }
};
