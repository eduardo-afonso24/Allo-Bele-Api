import mongoose from "mongoose";

const BookMarkSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    appointmentDate: { type: Date, required: true },
    confirmed: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
});

BookMarkSchema.index({ clientId: 1 });
BookMarkSchema.index({ barberId: 1 });
BookMarkSchema.index({ timestamp: -1 });
export const BookMark = mongoose.model('BookMark', BookMarkSchema);