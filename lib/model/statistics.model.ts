import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  date: { type: Date, required: true },
  viewers: { type: Number },
  likes: { type: Number },
  comments: { type: Number },
});

const Statistics = mongoose.model("Statistics", statisticsSchema);
export default Statistics;
