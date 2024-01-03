import mongoose from "mongoose";

let isConnected = false;
let MONGODB_URI = `mongodb://3.34.195.228:27017/crawler`;
export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("debug", true);

  if (!MONGODB_URI) {
    return console.log("MongoDB uri is not defined");
  }
  if (isConnected) {
    return console.log("=> using an existing database connection");
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error: any) {
    console.log(error.message);
  }
};
