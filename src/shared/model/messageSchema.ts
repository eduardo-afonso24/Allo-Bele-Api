import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    new: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Índices para melhorar buscas
MessageSchema.index({ roomId: 1 });

export const Message = mongoose.model("Message", MessageSchema);
