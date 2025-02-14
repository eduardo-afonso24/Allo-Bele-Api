import { Message, Room } from "../../../../shared";

export const sendMessageService = async (username: string, message: string, roomId: string, senderId: string) => {
    const messages = new Message({
        senderId,
        username,
        message,
        roomId
    })

    return await messages.save();
};

export const getMessagesByRoomIdService = async (
    roomId: string) => {
    const room = await Room.findOne({ name: roomId });
    if (room) {
        const id = String(room._id);
        const message = await Message.find({ roomId: id });
        return message;
    }

}