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
    connectDB();
    const scrapeData = await scrapeNaverData(restaurantUrl);
    console.log(`file: index.ts:58 ~ scrapeData:`, scrapeData);
    if (!scrapeData) return;

    const existingBrand = await Store.findOne({
      phoneNumber: scrapeData.phoneNumber,
    });

    if (existingBrand) {
      console.log("Brand exists");
      return;
    }

    const blogReview = parseInt(scrapeData.blogReview, 10) || 0;
    const visitorReview = parseInt(scrapeData.visitorsReview, 10) || 0;

    const socialLinks = scrapeData.socialLinks
      ? scrapeData.socialLinks.split(",")
      : [];

    const newStore = await Store.findOneAndUpdate({
      storeName: scrapeData.name,
      address: scrapeData.address,
      type: scrapeData.category,
      phoneNumber: scrapeData.phone,
      blogReview: blogReview,
      visitorReview: visitorReview,
      socialLinks: socialLinks,
    });

    revalidatePath(`/pages/products/${newStore?._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getAllStores() {
  try {
    connectDB();
    const stores = await Store.find();

    return stores;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getStoreById(storeId: string) {
  try {
    connectDB();

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
