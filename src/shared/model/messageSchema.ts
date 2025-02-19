import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String },
    roomId: { type: String, required: true },
    new: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', MessageSchema);