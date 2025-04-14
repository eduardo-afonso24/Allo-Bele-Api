import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  image: {
    type: String,
    required: [false]
  },
  profession: {
    type: String,
    required: [false]
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: [true, "Email Already Exists"],
    validate: validator.isEmail,
  },
  phone: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    enum: ["Feminino", "Masculino"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password must be at least 4 characters long"],
  },
  address: {
    type: String,
    required: [false],
  },
  dateOfBirth: {
    type: Date,
    required: [false],
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
    default: "client",
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  professionalServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfissionalService"
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
    required: [false],
  },
  verificationByEmailToken: {
    type: String,
    required: [false],
  },
  verificationByEmailExpires: {
    type: Date,
    required: [false],
  },
  token: {
    type: String,
    default: false,
  },
});

export const User = mongoose.model("User", UserSchema);
