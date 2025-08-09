import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryProduct",
    required: false,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: false,
  },
  description: { type: String },
  discount: { type: Number, required: false },
  discountedPrice: { type: Number, required: false },
  promotion: { type: Boolean, default: false },
  unavailable: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

ProductsSchema.index({ brand: 1 });
ProductsSchema.index({ category: 1 });
ProductsSchema.index({ timestamp: -1 });

export const Products = mongoose.model("Products", ProductsSchema);
