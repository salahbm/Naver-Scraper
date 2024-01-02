"use server";
import { UserType } from "@/types";
import { connectDB } from "../database/mongoose";
import { scrapeNaverData } from "../scraper";

import { revalidatePath } from "next/cache";
import Store from "../model/store.model";
import User from "../model/user.model";

export async function scrapeAndStoreProduct(restaurantUrl: string) {
  if (!restaurantUrl) return;

  try {


    const scrapeData = await scrapeNaverData(restaurantUrl);
    console.log(`file: index.ts:58 ~ scrapeData:`, scrapeData);

    // if (
    //   !scrapeData ||
    //   !scrapeData.name ||
    //   !scrapeData.address ||
    //   !scrapeData.category ||
    //   !scrapeData.phone
    // ) {
    //   console.log("Insufficient data to create a store");
    //   return;
    // }
    // await connectDB();
    // const blogReview = parseInt(scrapeData.blogReview, 10) || 0;
    // const visitorReview = parseInt(scrapeData.visitorsReview, 10) || 0;

    // const socialLinks = scrapeData.socialLinks ? scrapeData.socialLinks : [];

    // const newStore = await Store.create({
    //   scrapeData: {
    //     logo: scrapeData.logo,
    //     name: scrapeData.name,
    //     category: scrapeData.category,
    //     address: scrapeData.address,
    //     phone: scrapeData.phone,
    //     socialLinks: socialLinks,
    //     visitorsReview: visitorReview.toString(),
    //     blogReview: blogReview.toString(),
    //     reviews: Array.isArray(scrapeData.reviews) ? scrapeData.reviews : [],
    //     trendingKeywords: Array.isArray(scrapeData.trendingKeywords)
    //       ? scrapeData.trendingKeywords
    //       : [],
    //   },
    // });

    // revalidatePath(`/pages/products/${newStore?._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getAllStores() {
  try {
    await connectDB();
    const stores = await Store.find();

    if (stores.length === 0) {
      console.log("No stores found in the collection.");
      return;
    } else {
      return stores;
    }
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getStoreById(storeId: string) {
  try {
   await connectDB();

    const store = await Store.findOne({ _id: storeId });

    if (!store) return null;

    return store;
  } catch (error) {
    console.log(error);
  }
}
// User Actions
export async function saveUsers(users: UserType) {
  if (!users) return;
  let newUser;
  try {
    await connectDB(); // Connect to the database

    const existingUser = await User.findOne({ phoneNumber: users.phoneNumber });

    if (existingUser) {
      console.log("User exists", existingUser);
      // Handle existing user logic (e.g., redirect)
    } else {
      // Create a new user
      newUser = new User({
        username: users.name,
        email: users.email,
        passwordHash: users.password,
        phoneNumber: users.phoneNumber,
        recommendCode: users.recommendCode,
      });

      // Save the user to the database
      await newUser.save();
      console.log("User created successfully");
    }

    return newUser;
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
