// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const { connection } = await mongoose.connect("mongodb://netag:Angola2024%23@95.216.215.24:27017/", {
//       dbName: "AlloBelleDatabase",
//     });

//     mongoose.set("debug", true);
//     console.log(`Server connected to database ${connection.host}`);
//   } catch (error) {
//     console.log("Some Error Occurred", error);
//     process.exit(1);
//   }
// }

// databaseCon.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect("mongodb://127.0.0.1:27017/", {
      dbName: "AlloBelleDatabase",
    });

    mongoose.set("debug", true);
    console.log(`✅ Connected to MongoDB at ${connection.host}`);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
