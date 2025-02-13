import mongoose from "mongoose";

const ConfirmationMessageSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barberEmail: { type: String, required: true },
    clientEmail: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export const ConfirmationMessage = mongoose.model('ConfirmationMessage', ConfirmationMessageSchema);
