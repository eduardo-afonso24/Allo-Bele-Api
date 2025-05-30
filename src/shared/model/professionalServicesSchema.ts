import mongoose from "mongoose";

const ProfissionalServiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});


ProfissionalServiceSchema.index({ userId: 1 });
ProfissionalServiceSchema.index({ category: 1 });
ProfissionalServiceSchema.index({ timestamp: -1 });

export const ProfissionalService = mongoose.model('ProfissionalService', ProfissionalServiceSchema);
