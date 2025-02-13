import { Room } from "../../../../shared";

export const addUserToRoomService = async (roomId: string, userId: string) => {
    const room = await Room.findById(roomId);
    if (room) {
        room.participants.push(userId);
        await room.save();
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