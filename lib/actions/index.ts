"use server";

import { connectDB } from "../database/mongoose";
import { scrapeNaverData } from "../scraper";
import { revalidatePath } from "next/cache";
import Store from "../model/store.model";
import mongoose from "mongoose";
import User from "../model/user.model";

export async function scrapeAndStoreProduct(
  restaurantUrl: string,
  email: string
) {
  if (!restaurantUrl && !email) return;

  try {
    const scrapeData = await scrapeNaverData(restaurantUrl);
    console.log(`file: index.ts:58 ~ scrapeData:`, scrapeData?.name);

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

    await connectDB();
    const blogReview = parseInt(scrapeData.blogReview, 10) || 0;
    const visitorReview = parseInt(scrapeData.visitorsReview, 10) || 0;

    const socialLinks = scrapeData.socialLinks ? scrapeData.socialLinks : [];

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
        visitorsReview: visitorReview.toString(),
        blogReview: blogReview.toString(),
        reviews: Array.isArray(scrapeData.reviews) ? scrapeData.reviews : [],
        trendingKeywords: Array.isArray(scrapeData.trendingKeywords)
          ? scrapeData.trendingKeywords
          : [],
      },
    });
    console.log(`Saved in DB`, newStore?.scrapeData?.name);

    revalidatePath(`/pages/products/${newStore?._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
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
    const stores = await Store.find({ user: user._id });

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
    const objectId = new mongoose.Types.ObjectId(storeId);

    const store = await Store.findOne({ _id: objectId });

    if (!store) return null;

    return store;
  } catch (error: any) {
    console.log("Cant store by id", error.message);
  }
}
