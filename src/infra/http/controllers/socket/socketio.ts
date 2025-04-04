import { Server, Socket } from 'socket.io';
import { sendMessageService } from '../message';

export const handleSocketConnection = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', async ({ name, roomId }) => {
      //   await userService.createOrUpdateUser(name, socket.id);
      socket.join(roomId);
      console.log(`${name} joined room: ${roomId}`);
    });

    // socket.on('message', async ({ roomId, senderId, username, text }) => {
    //   const message = await sendMessageService(
    //     username,
    //     text,
    //     roomId,
    //     senderId,

    //   );
    //   io.to(roomId).emit('message', message);
    // });

    socket.on('disconnect', async () => {
      //   await userService.deleteUserBySocketId(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  io.on("error", (error) => {
    console.error("⚠️ Erro no Socket.IO:", error);
  });
};