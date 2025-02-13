import mongoose from "mongoose";

const BookMarkSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentDate: { type: Date, required: true },
    confirmed: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
});

export const BookMark = mongoose.model('BookMark', BookMarkSchema);