import mongoose from "mongoose";
import { Room } from "../../../../shared";

export const addUserToRoomService = async (roomId: string, userId: string) => {
  console.log("Usuário está na sala");
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const room = await Room.findOne({ name: roomId });

  if (room) {
    if (!room.participants.includes(userObjectId)) {
      room.participants.push(userObjectId);
      await room.save();
    } else {
      console.log("Usuário já está na sala");
    }
    return room;
  } else {
    const newRoom = new Room({ name: roomId, participants: [userObjectId] });
    await newRoom.save();
    return newRoom;
  }
};



export const createRoomService = async (roomName: string) => {
  const room = new Room({ name: roomName });
  await room.save();
  return room;
};

export const getAllRoomsService = async () => {
  return await Room.find();
};