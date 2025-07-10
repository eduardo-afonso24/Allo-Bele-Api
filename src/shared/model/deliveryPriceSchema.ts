import mongoose from "mongoose";

const DeliveryPriceSchema = new mongoose.Schema({
  price: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


DeliveryPriceSchema.index({ timestamp: -1 });

export const DeliveryPrice = mongoose.model('DeliveryPrice', DeliveryPriceSchema);
