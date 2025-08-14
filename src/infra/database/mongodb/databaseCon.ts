import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect("mongodb://admin:Angola2024%23@176.126.242.168:27017/", {
      dbName: "AlloBelleDatabase",
    });

    mongoose.set("debug", true);
    console.log(`✅ Connected to MongoDB at ${connection.host}`);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
