import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


BrandSchema.index({ timestamp: -1 });

export const Brand = mongoose.model('Brand', BrandSchema);
