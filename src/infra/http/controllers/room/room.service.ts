import mongoose from "mongoose";
import { Room } from "../../../../shared";

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

// Gera um nome de sala único baseado nos dois IDs, ordenados
const generateRoomName = (userId: string, receiverId: string) => {
  return [userId, receiverId].sort().join("_");
};

export const createOrGetRoomService = async (userId: string, receiverId: string) => {
  const userObjectId = toObjectId(userId);
  const receiverObjectId = toObjectId(receiverId);
  const roomName = generateRoomName(userId, receiverId);

  // Tenta encontrar uma sala já existente com os dois participantes
  let room = await Room.findOne({ name: roomName });

  if (room) {
    // Verifica se o usuário já está listado
    const isUserInRoom = room.participants.some(p => p.toString() === userId);
    if (!isUserInRoom) {
      room.participants.push(userObjectId);
      await room.save();
    }
  } else {
    // Cria nova sala com os dois participantes
    room = new Room({
      name: roomName,
      participants: [userObjectId, receiverObjectId],
    });
    await room.save();
    console.log("Nova sala criada");
  }

  return room;
};



// import mongoose from "mongoose";
// import { Room } from "../../../../shared";

// export const addUserToRoomService = async (roomId: string, userId: string, receiverId: string) => {
//   console.log("Usuário está na sala");
//   const userObjectId = new mongoose.Types.ObjectId(userId);
//   const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
//   const room = await Room.findOne({ name: roomId });

//   if (room) {
//     if (!room.participants.includes(userObjectId)) {
//       room.participants.push(userObjectId);
//       await room.save();
//     } else {
//       console.log("Usuário já está na sala");
//     }
//     return room;
//   } else {
//     const newRoom = new Room({ name: roomId, participants: [userObjectId, receiverObjectId] });
//     await newRoom.save();
//     return newRoom;
//   }
// };



// export const createRoomService = async (roomName: string) => {
//   const room = new Room({ name: roomName });
//   await room.save();
//   return room;
// };

// export const getAllRoomsService = async () => {
//   return await Room.find().lean();
// };