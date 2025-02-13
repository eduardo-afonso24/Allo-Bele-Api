import mongoose from "mongoose";

export const connectDB = async () =>{    
  try {
    const { connection } = await mongoose.connect("mongodb://netag:Angola2024%23@95.216.215.24:27017/", {
      dbName: "AlloBelleDatabase",
    });
    console.log(`Server connected to database ${connection.host}`);
  } catch (error) {
    console.log("Some Error Occurred", error);
    process.exit(1);
  }
}