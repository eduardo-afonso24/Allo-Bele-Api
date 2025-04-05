import mongoose from "mongoose";

const ConfirmationRequetsSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    baberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    baberName: {
        type: String,
        required: true
    },
    selectedServices: [{
        _id: String,
        description: String,
        price: Number,
        serviceName: String,
        timestamp: Date,
        userId: String,
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    type_payment: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    new: {
        type: Boolean,
        default: false,
    },
    timestamp: { type: Date, default: Date.now },
});


export const ConfirmationRequets = mongoose.model('confirmationRequests', ConfirmationRequetsSchema);