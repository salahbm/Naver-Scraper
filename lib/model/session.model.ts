import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
  },
});

export const Session = mongoose.model("Session", sessionSchema);
