import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin/app";
import firebaseKeyFcm from '../config/firebaseKeyFcmJson.json';

// Inicialize o Firebase Admin SDK apenas uma vez fora da função sendPushNotification
const serviceAccount: ServiceAccount = firebaseKeyFcm as ServiceAccount;
admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
    },
    "AloBelleFcm"
);

export const sendPushNotification = async (
    token: string,
    title: string,
    body: string,
    url: string
) => {

    try {

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
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error); // Mudado para refletir o erro correto
    }
};