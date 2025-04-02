import mongoose from "mongoose";

const PushNotificationSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
});

export const PushNotification = mongoose.model('PushNotification', PushNotificationSchema);