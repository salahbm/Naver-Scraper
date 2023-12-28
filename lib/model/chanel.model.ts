import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  name: { type: String, required: true },
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
