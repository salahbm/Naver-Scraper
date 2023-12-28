import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  recommendCode: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
