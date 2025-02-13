import mongoose from "mongoose";

const pubsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  timestamp: { type: Date, default: Date.now },
});

export const Pubs = mongoose.model('pubs', pubsSchema);


