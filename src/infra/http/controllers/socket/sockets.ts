// sockets.ts
import { Server, Socket } from "socket.io";
import { Message, PushNotification, User } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";
import { createOrGetRoomService } from "../room";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    path: "/api/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔥 Novo usuário conectado: ${socket.id}`);

    // Entrar em uma sala
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
    });

    // Enviar mensagem para um usuário
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        // Cria ou obtém a sala entre os dois usuários
        const room = await createOrGetRoomService(senderId, receiverId);

        // Cria e salva a nova mensagem
        const newMessage = new Message({
          senderId,
          receiverId,
          roomId: room._id,
          username: (await User.findById(senderId))?.name || "",
          receivername: (await User.findById(receiverId))?.name || "",
          message,
        });

        await newMessage.save();

        // Emite a nova mensagem para todos na sala
        io.to(room._id.toString()).emit("receiveMessage", newMessage);

        // Envia notificação push
        const pushToken = await PushNotification.findOne({ userId: receiverId });
        if (pushToken) {
          const preview = message.length > 30 ? message.slice(0, 27) + "..." : message;
          await sendPushNotificationExpo(
            pushToken.token,
            "Nova mensagem",
            preview,
            "/screens/client/(tabs)/home"
          );
        }

      } catch (error) {
        console.error("Erro ao enviar mensagem via socket:", error);
        socket.emit("messageError", "Erro ao enviar mensagem");
      }
    });

    socket.on("createOrJoinRoom", async ({ senderId, receiverId }, callback) => {
      try {
        const room = await createOrGetRoomService(senderId, receiverId);
        socket.join(room._id.toString());
        console.log(`Usuário ${socket.id} entrou/criou a sala ${room._id}`);

        // Retorna dados da sala para o cliente via callback
        callback({ success: true, roomId: room._id });
      } catch (error) {
        console.error("Erro ao criar ou entrar na sala:", error);
        callback({ success: false, error: "Erro ao criar ou entrar na sala" });
      }
    });


    socket.on("disconnect", () => {
      console.log(`⚠️ Usuário desconectado: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("⚠️ Socket.IO não foi inicializado!");
  }
  return io;
};
