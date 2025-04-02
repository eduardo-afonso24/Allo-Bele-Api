import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    timestamp: { type: Date, default: Date.now },
});

export const Room = mongoose.model('Room', RoomSchema);