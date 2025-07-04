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
        required: false
    },
    baberName: {
        type: String,
        required: false
    },
    selectedServices: [{
        _id: String,
        description: String,
        price: Number,
        quantity: Number,
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
    authorized: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    inTraffic: {
        type: Boolean,
        default: false,
    },
    isItComplete: {
        type: Boolean,
        default: false,
    },
    iamHere: {
        type: Boolean,
        default: false,
    },
    new: {
        type: Boolean,
        default: false,
    },
    timestamp: { type: Date, default: Date.now },
});

ConfirmationRequetsSchema.index({ confirmed: 1, clientId: 1 });
ConfirmationRequetsSchema.index({ confirmed: 1, baberId: 1 });
ConfirmationRequetsSchema.index({ timestamp: -1 });

export const ConfirmationRequets = mongoose.model('confirmationRequests', ConfirmationRequetsSchema);