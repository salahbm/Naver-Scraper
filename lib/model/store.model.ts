// store.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  type: { type: String, required: true },
  count: { type: Number, required: true },
});

const keywordSchema = new mongoose.Schema({
  relKeyword: { type: String, required: true },
  monthlyPcQcCnt: { type: String },
  monthlyMobileQcCnt: { type: String },
  monthlyAvePcClkCnt: { type: String },
  monthlyAveMobileClkCnt: { type: String },
  monthlyAvePcCtr: { type: String },
  monthlyAveMobileCtr: { type: String },
  plAvgDepth: { type: String },
  compIdx: { type: String },
});

const scrapeDataSchema = new mongoose.Schema({
  logo: { type: String },
  name: { type: String, required: true },
  category: { type: String },
  address: { type: String },
  phone: { type: String },
  socialLinks: [{ type: String }],
  visitorsReview: { type: String },
  blogReview: { type: String },
  reviews: [reviewSchema],
  trendingKeywords: [{ type: String }],
  naverKeywords: [keywordSchema],
});

const storeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scrapeData: scrapeDataSchema,
  },
  { timestamps: true }
);

const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);

export default Store;
