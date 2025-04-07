import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    receivername: { type: String, required: true },
    message: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    new: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

MessageSchema.index({ roomId: 1 });

export const Message = mongoose.model("Message", MessageSchema);
