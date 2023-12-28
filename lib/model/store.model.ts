import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  blogReview: { type: Number, required: true },
  visitorReview: { type: Number, required: true },
  socialLinks: [{ type: String }],
});
const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
export default Store;
