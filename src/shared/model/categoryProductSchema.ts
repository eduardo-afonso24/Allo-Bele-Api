import mongoose from "mongoose";

const CategoryProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


CategoryProductSchema.index({ timestamp: -1 });

export const CategoryProduct = mongoose.model('CategoryProduct', CategoryProductSchema);
