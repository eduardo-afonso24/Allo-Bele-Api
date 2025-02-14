import { Room } from "../../../../shared";

export const addUserToRoomService = async (roomId: string, userId: string) => {
  const room = await Room.findOne({ name: roomId });

  if (room) {
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    } else {
      console.log("Usuário já está na sala");
    }
    return room;
  } else {
    const newRoom = new Room({ name: roomId, participants: [userId] });
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