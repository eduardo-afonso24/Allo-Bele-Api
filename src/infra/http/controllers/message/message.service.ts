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
        const message = await Message.find({ roomId: id }).sort({ createdAt: -1 });
        return message;
    }

}

export const getNewMessagesByRoomIdService = async (
    roomId: string) => {
    const room = await Room.findOne({ name: roomId });
    console.log({ room: room })
    if (room) {
        const id = String(room._id);
        const message = await Message.find({ roomId: id });
        console.log({ message: message })
        const newMessages = message.filter(msg => msg.new === true);
        const sortedMessages = newMessages.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        console.log({ newMessages: newMessages })
        console.log({ sortedMessages: sortedMessages })

        return sortedMessages;
    }

}