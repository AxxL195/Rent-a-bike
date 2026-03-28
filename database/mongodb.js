import mongoose from "mongoose";
import { DB_URL } from "../backend/config/env.js";

if(!DB_URL) {
  throw new Error("Database URL is not defined in environment variables.");
}

//connecting to the database
const connecttoDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with an error code
  }
}

export default connecttoDB;