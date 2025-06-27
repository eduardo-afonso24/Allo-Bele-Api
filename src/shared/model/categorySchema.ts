import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: false },
    timestamp: { type: Date, default: Date.now },
});

CategorySchema.index({ timestamp: -1 });
export const Category = mongoose.model('Category', CategorySchema);