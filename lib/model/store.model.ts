import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

export const Store = mongoose.model("Store", storeSchema);
