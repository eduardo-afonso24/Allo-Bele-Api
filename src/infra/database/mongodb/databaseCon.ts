import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/AlloBelleDatabase";

    const { connection } = await mongoose.connect(dbURI);

    mongoose.set("debug", true);
    console.log(`✅ Connected to MongoDB at ${connection.host}`);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};