import mongoose from "mongoose";

const BarbersShopsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  image: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: [true, "Email Already Exists"],
  },
  phone: {
    type: Number,
    unique: [true, "Email Already Exists"],
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password must be at least 4 characters long"],
  },
  address: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    default: 4.8
  },
  hours: {
    type: String,
    required: false,
    default: '9:00-21:00'
  },
  distance: {
    type: String,
    required: false,
    default: '0.7 km'
  },
  status: {
    type: Boolean,
    default: true,
  },
  occupied: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["client", "barber", "company", "admin"],
    default: "company",
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BarberShopsServicesSchema"
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookMark"
  }],
  confirmationMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConfirmationMessage"
  }],
  nif: {
    type: String,
    required: false,
  },
  verificationByEmailToken: {
    type: String,
    required: false,
  },
  verificationByEmailExpires: {
    type: Date,
    required: false,
  },
  token: {
    type: String,
    default: false,
  },
});

export const BarbersShops = mongoose.model("BarbersShops", BarbersShopsSchema);
