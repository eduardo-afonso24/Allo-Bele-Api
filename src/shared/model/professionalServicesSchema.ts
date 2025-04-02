import mongoose from "mongoose";

const ProfissionalServiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    to: { type: Number, default: 0 },
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
  });
  
export const ProfissionalService = mongoose.model('ProfissionalService', ProfissionalServiceSchema);
  