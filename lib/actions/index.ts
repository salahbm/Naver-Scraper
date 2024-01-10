"use server";

import { connectDB } from "../database/mongoose";
import { scrapeNaverData } from "../scraper";
import Store from "../model/store.model";
import mongoose from "mongoose";
import User from "../model/user.model";
import { NaverKeywordData } from "@/types";

export async function scrapeAndStoreProduct(
  storeName: string,
  email: string,
  selectedIframe: string,
  naverKeywords: NaverKeywordData[]
) {
  console.log(`file: index.ts:16 ~ naverKeywords:`, naverKeywords);
  if (!storeName || !email) return;

  try {
    const scrapeData = await scrapeNaverData(storeName, selectedIframe);

    if (
      !scrapeData ||
      !scrapeData.name ||
      !scrapeData.address ||
      !scrapeData.category ||
      !scrapeData.phone
    ) {
      console.log("Insufficient data to create a store");
      return;
    }

    console.log("Started storing in the DB");

    const socialLinks = scrapeData.socialLinks || [];

    await connectDB();
    console.log(scrapeData.reviews);

    // Assuming you have a User model
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return;
    }

    const newStore = await Store.create({
      user: user._id,
      scrapeData: {
        logo: scrapeData.logo,
        name: scrapeData.name,
        category: scrapeData.category,
        address: scrapeData.address,
        phone: scrapeData.phone,
        socialLinks: socialLinks,
        visitorsReview: scrapeData.visitorsReview,
        blogReview: scrapeData.blogReview,
        reviews: Array.isArray(scrapeData.reviews) ? scrapeData.reviews : [],
        naverKeywords: Array.isArray(naverKeywords) ? naverKeywords : [],
        trendingKeywords: Array.isArray(scrapeData.trendingKeywords)
          ? scrapeData.trendingKeywords
          : [],
      },
    });

    console.log(`Saved in DB`, newStore);
  } catch (error: any) {
    console.error(`Failed to create/update product:`, error.message);
    throw new Error(`Failed to create/update product: ${error.message}`);
  } finally {
    await mongoose.connection.close();
  }
}

// Update the getAllStores function to accept a user email parameter
export async function getAllStores(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return [];
    }

    // Find stores that match the provided user email
    const stores = await Store.find();

    if (stores.length === 0) {
      console.log(`No stores found for the user with email: ${user._id}`);
      return [];
    } else {
      return stores;
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to get stores: ${error.message}`);
  }
}

export async function getStoreById(storeId: string) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      throw new Error("Invalid ObjectId format");
    }

    const store = await Store.findOne({ _id: storeId });
    console.log(`file: index.ts:103 ~ store:`, store);

    if (!store) return null;

    return store;
  } catch (error: any) {
    console.log("Cant store by id", error.message);
  }
}
