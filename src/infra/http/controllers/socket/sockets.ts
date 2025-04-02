import { Server, Socket } from "socket.io";
import { sendMessageService } from "../message";
import { addUserToRoomService } from "../room";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔥 Novo usuário conectado: ${socket.id}`);

    socket.on("joinRoom", async ({ roomId, userId }) => {
      try {
        console.log("CALL JOIN ROOM ")
        const room = await addUserToRoomService(roomId, userId as string);
        const newRoomId = String(room._id);
        socket.join(newRoomId);
        console.log(`👤 ${userId} entrou na sala: ${newRoomId}`);

        // Notifica os usuários da sala que um novo usuário entrou
        const data = { newRoomId, userId }
        // socket.to(newRoomId).emit("userJoined", data);
        socket.emit("userJoined", data);
        console.log({ newRoomId, userId })
        console.log("Depois de emitir")
      } catch (error) {
        console.error("Erro ao criar a sala :", error);
      }
    });

    socket.on("sendMessage", async ({ roomId, senderId, username, text }) => {
      try {
        const data_message = { senderId, username, text, roomId, timestamp: new Date() };
        console.log({ data_message: data_message })
        const message = text;
        const newMessage = await sendMessageService(username, message, roomId, senderId);

        io.to(roomId).emit("receiveMessage", newMessage);
        console.log(`📩 ${username} enviou uma mensagem na sala ${roomId}`);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
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
