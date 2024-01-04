import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("debug", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MongoDB uri is not defined");
  }
  if (isConnected) {
    return console.log("=> using an existing database connection");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error: any) {
    console.log(error.message);
  }
};
