// store.model.js
import { NaverKeywordData } from "@/types";
import mongoose, { Schema, Document } from "mongoose";

interface Review {
  type: string;
  count: number;
}

interface ScrapeData {
  logo?: string;
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  socialLinks?: string[];
  visitorsReview?: string;
  blogReview?: string;
  reviews?: Review[];
  trendingKeywords?: string[];
  naverKeywords?: any[];
}

interface StoreDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  naverKeywords: NaverKeywordData[];
  scrapeData: ScrapeData;
}

const reviewSchema = new Schema<Review>({
  type: { type: String, required: true },
  count: { type: Number, required: true },
});

const keywordSchema = new mongoose.Schema({
  relKeyword: { type: String, required: true },
  monthlyPcQcCnt: { type: Number },
  monthlyMobileQcCnt: { type: Number },
  monthlyAvePcClkCnt: { type: Number },
  monthlyAveMobileClkCnt: { type: Number },
  monthlyAvePcCtr: { type: Number },
  monthlyAveMobileCtr: { type: Number },
  plAvgDepth: { type: Number },
  compIdx: { type: String },
});

const scrapeDataSchema = new Schema<ScrapeData>({
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
});

const storeSchema = new Schema<StoreDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    naverKeywords: [keywordSchema],
    scrapeData: scrapeDataSchema,
  },
  { timestamps: true }
);

const Store =
  (mongoose.models.Store as mongoose.Model<StoreDocument>) ||
  mongoose.model<StoreDocument>("Store", storeSchema);

export default Store;
