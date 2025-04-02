import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin/app"; // Importe o tipo ServiceAccount
import firebaseKeyFcm from "../config/firebaseKeyFcm";


export const sendPushNotification = async (
    token: string,
    title: string,
    body: string,
    url: string
) => {
    if (!admin.apps.some((app) => app.name === "AloBelleFcm")) {
        const serviceAccount: ServiceAccount = firebaseKeyFcm as ServiceAccount;
        admin.initializeApp(
            {
                credential: admin.credential.cert(serviceAccount),
            },
            "AloBelleFcm"
        );
    }

    const message = {
        token,
        notification: {
            title,
            body,
        },
        data: {
            url,
        },
        android: {
            priority: "high" as "high",
            notification: {
                channelId: "default",
                sound: "default",
            },
        },
        apns: {
            payload: {
                aps: {
                    alert: {
                        title,
                        body,
                    },
                    sound: "default",
                },
            },
        },
    };

    admin
        .app("AloBelleFcm")
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Mensagem enviada com sucesso:", response);
        })
        .catch((error) => {
            console.log("Erro ao enviar mensagem:", error);
        });
};
