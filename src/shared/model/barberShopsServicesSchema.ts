import mongoose from "mongoose";

const BarberShopsServicesSchema = new mongoose.Schema({
  barbersShopsId: { type: mongoose.Schema.Types.ObjectId, ref: 'BarbersShops', required: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});


BarberShopsServicesSchema.index({ userId: 1 });
BarberShopsServicesSchema.index({ barbersShopsId: 1 });
BarberShopsServicesSchema.index({ category: 1 });
BarberShopsServicesSchema.index({ timestamp: -1 });

export const BarberShopsServices = mongoose.model('BarberShopsServices', BarberShopsServicesSchema);
