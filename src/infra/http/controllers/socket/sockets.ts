

// sockets.ts (backend)
import { Server, Socket } from "socket.io";
import { Message, PushNotification, Room, User } from "../../../../shared";
import { sendPushNotificationExpo } from "../../../../helpers/functions/sendPushNotificationExpo";
import { createOrGetRoomService } from "../room";
import mongoose from "mongoose";

interface PopulatedParticipant {
  _id: mongoose.Types.ObjectId;
  name: string;
}

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

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const room = await createOrGetRoomService(senderId, receiverId);

        if (!socket.rooms.has(room._id.toString())) {
          socket.join(room._id.toString());
        }

        const newMessage = new Message({
          senderId,
          receiverId,
          roomId: room._id,
          username: (await User.findById(senderId))?.name || "Usuário Desconhecido",
          receivername: (await User.findById(receiverId))?.name || "Usuário Desconhecido",
          message,
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('senderId', 'name') // Popula o senderId para ter o nome
          .populate('receiverId', 'name') // Popula o receiverId para ter o nome
          .lean(); // Retorna um objeto JS simples

        // Emite a mensagem populada para todos os sockets na sala
        io.to(room._id.toString()).emit("receiveMessage", populatedMessage);

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
        socket.emit("messageError", "Erro ao enviar mensagem");
      }
    });

    socket.on("createOrJoinRoom", async ({ senderId, receiverId }, callback) => {
      try {
        const room = await createOrGetRoomService(senderId, receiverId);
        socket.join(room._id.toString());

        // Retorna dados da sala para o cliente via callback
        callback({ success: true, roomId: room._id.toString() });
      } catch (error) {
        callback({ success: false, error: "Erro ao criar ou entrar na sala" });
      }
    });

    socket.on("getRoomMessages", async (roomId: string, callback) => {
      try {
        const messages = await Message.find({ roomId: roomId })
          .populate('senderId', 'name')
          .populate('receiverId', 'name')
          .sort({ timestamp: 1 })
          .lean();
        callback({ success: true, messages });
      } catch (error) {
        callback({ success: false, error: "Erro ao carregar mensagens da sala" });
      }
    });


    socket.on("getUserRooms", async (userId: string, callback) => {
      try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const rooms = await Room.find({ participants: userObjectId })
          .populate<{ participants: PopulatedParticipant[] }>('participants', 'name')
          .lean();

        const formattedRooms = await Promise.all(rooms.map(async (room) => {
          const otherParticipant = room.participants.find(p => p._id.toString() !== userId);

          const lastMessageDoc = await Message.findOne({ roomId: room._id })
            .sort({ timestamp: -1 })
            .select('message timestamp')
            .lean();

          return {
            _id: room._id.toString(),
            name: room.name,
            lastMessage: lastMessageDoc ? lastMessageDoc.message : null,
            lastTimestamp: lastMessageDoc ? lastMessageDoc.timestamp : null,
            receiver: otherParticipant ? { _id: otherParticipant._id.toString(), name: otherParticipant.name } : null,
            participants: room.participants.map(p => ({ _id: p._id.toString(), name: p.name }))
          };
        }));

        callback({ success: true, rooms: formattedRooms });
      } catch (error) {
        console.error("Erro ao buscar salas do usuário (via modelo Room):", error);
        callback({ success: false, error: "Erro ao buscar salas do usuário." });
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