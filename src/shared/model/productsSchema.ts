import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryProduct', required: false },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: false },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});


ProductsSchema.index({ brand: 1 });
ProductsSchema.index({ category: 1 });
ProductsSchema.index({ timestamp: -1 });

export const Products = mongoose.model('Products', ProductsSchema);
