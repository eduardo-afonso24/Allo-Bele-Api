import mongoose from "mongoose";

const PromotionsSchema = new mongoose.Schema({
  brand: { type: String, required: false },
  title: { type: String, required: false },
  image: { type: String, required: false },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

PromotionsSchema.index({ timestamp: -1 });

export const Promotions = mongoose.model("Promotions", PromotionsSchema);
