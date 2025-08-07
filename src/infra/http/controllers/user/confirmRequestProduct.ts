// import { Response, Request } from "express";
// import { PushNotification, RequestProducts, User } from "../../../../shared";
// import { getIO } from "../socket/sockets";
// import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";

// export const confirmRequestProduct = async (req: Request, res: Response) => {
//   const { requestId } = req.params;
//   const { confirmed } = req.body;
//   console.log("CHAMANDO CONFIRM REQUEST");
//   try {
//     const findRequest = await RequestProducts.findById(requestId);
//     if (!findRequest) {
//       return res.status(404).json({ message: "Encomenda não encontrada" });
//     }

//     const request = await RequestProducts.findByIdAndUpdate(
//       requestId,
//       {
//         confirmed,
//         isUnread: true,
//       },
//       { new: true }
//     );

//     const updatedRequest = await RequestProducts.find({})
//       .sort({ timestamp: -1 })
//       .populate("products.product", "_id image name price")
//       .lean();

//     const text =
//       confirmed === 1
//         ? "📦 A sua encomenda está a caminho! Prepare-se para recebê-la em breve. 🚚"
//         : confirmed === 3
//         ? "✅ A sua encomenda foi entregue com sucesso! Obrigado pela preferência. 💖"
//         : confirmed === 2
//         ? "❌ A sua encomenda foi recusada. Se tiver dúvidas, entre em contacto conosco."
//         : "";
//     const user = await User.findOne({ phone: request.phone });

//     if (request?.expoToken && request.expoToken.trim().length > 0) {
//       const urlScreens = "/screens/client/(tabs)/home";
//       await sendPushNotificationExpo(
//         request?.expoToken,
//         "Atualização da encomenda",
//         text,
//         urlScreens
//       );
//     } else if (user) {
//       const expoToken = await PushNotification.findOne({ userId: user._id });
//       console.log({ confime: expoToken });

//       if (expoToken) {
//         const urlScreens = "/screens/client/(tabs)/home";
//         await sendPushNotificationExpo(
//           expoToken.token,
//           "Atualização da encomenda",
//           text,
//           urlScreens
//         );
//       }
//     }

//     getIO().emit("requestProducts", updatedRequest);
//     return res.status(200).json(request);
//   } catch (error) {
//     console.error("Erro ao confirmar a encomenda", error);
//     return res.status(500).json({ message: "Erro ao confirmar a encomenda." });
//   }
// };

import { Response, Request } from "express";
import { PushNotification, RequestProducts, User } from "../../../../shared";
import { getIO } from "../socket/sockets";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";

export const confirmRequestProduct = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { confirmed } = req.body;


  try {
    const findRequest = await RequestProducts.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    const request = await RequestProducts.findByIdAndUpdate(
      requestId,
      {
        confirmed,
        isUnread: true,
      },
      { new: true }
    );

    const updatedRequest = await RequestProducts.find({})
      .sort({ timestamp: -1 })
      .populate("products.product", "_id image name price")
      .lean();

    const text =
      confirmed === 1
        ? "📦 A sua encomenda está a caminho! Prepare-se para recebê-la em breve. 🚚"
        : confirmed === 3
        ? "✅ A sua encomenda foi entregue com sucesso! Obrigado pela preferência. 💖"
        : confirmed === 2
        ? "❌ A sua encomenda foi recusada. Se tiver dúvidas, entre em contacto conosco."
        : "";

    const urlScreens = "/screens/client/(tabs)/home";
    const user = await User.findOne({ phone: request.phone });

    if (request?.expoToken && request.expoToken.trim().length > 0) {
      await sendPushNotificationExpo(
        request.expoToken,
        "Atualização da encomenda",
        text,
        urlScreens
      );
    } else if (user) {
      const expoToken = await PushNotification.findOne({ userId: user._id });

      if (expoToken?.token && expoToken.token.trim().length > 0) {
        await sendPushNotificationExpo(
          expoToken.token,
          "Atualização da encomenda",
          text,
          urlScreens
        );
      }
    }

    getIO().emit("requestProducts", updatedRequest);
    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao confirmar a encomenda." });
  }
};
