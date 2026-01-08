//database connect with mongoose
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const db_response = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(` Database connected successfully!!`);
    // console.log(`DB HOST:${db_response.connection.host}`);
  } catch (error) {
    console.log("DATABASE CONNECTION FAILED:", error);
    process.exit(1);
  }
}; // jb async method complete hota h to wo aik promise bhi return krta h

export default connectDB;
