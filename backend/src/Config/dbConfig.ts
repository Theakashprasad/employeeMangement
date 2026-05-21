import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: process.env.MONGODB_DB_NAME || "employee_management",
    });
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
