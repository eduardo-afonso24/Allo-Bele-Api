export const sendPushNotificationExpo = async (
    token: string,
    title: string,
    body: string,
    url: string
  ) => {
    try {
      const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: { url },
      };
  
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
  
      const data = await response.json();
  
      if (data?.data?.status === "ok") {
        console.log("Notificação enviada com sucesso:", data);
      } else {
        console.error("Erro ao enviar notificação:", data);
      }
    } catch (error) {
      console.error("Erro ao enviar push notification com Expo:", error);
    }
  };
  