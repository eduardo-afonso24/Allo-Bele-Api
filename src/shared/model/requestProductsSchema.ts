import mongoose from "mongoose";

const RequestProductsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true },
  payment: { type: String, required: false },
  confirmed: { type: Number, default: 0 },
  isUnread: { type: Boolean, default: false },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  timestamp: { type: Date, default: Date.now },
});

RequestProductsSchema.index({ timestamp: -1 });

export const RequestProducts = mongoose.model('RequestProducts', RequestProductsSchema);
