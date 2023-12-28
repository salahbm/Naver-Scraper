import mongoose from "mongoose";

let isConnected = false;
const MONGODB_URI = "mongodb://localhost:27017/crawler";

export const connectDB = async () => {
  if (!MONGODB_URI) {
    return console.log("MongoDB URI is not defined");
  }

  if (isConnected) {
    return console.log("=> Using an existing database connection");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
