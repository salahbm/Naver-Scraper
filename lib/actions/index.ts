"use server";
import { UserType } from "@/types";
import { connectDB } from "../database/mongoose";
import { scrapeNaverData } from "../scraper";

import { revalidatePath } from "next/cache";
import Store from "../model/store.model";
import User from "../model/user.model";
import mongoose from "mongoose";

export async function scrapeAndStoreProduct(restaurantUrl: string) {
  if (!restaurantUrl) return;

  try {
    const scrapeData = await scrapeNaverData(restaurantUrl);
    console.log(`file: index.ts:58 ~ scrapeData:`, scrapeData);

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

    const newStore = await Store.create({
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
    console.log("Scraped Data is Stored", newStore?._id);

    revalidatePath(`/pages/products/${newStore?._id}`);
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
// User Actions
export async function saveUsers(users: UserType) {
  if (!users) return;
  let newUser;
  try {
    await connectDB(); // Connect to the database

    const existingUser = await User.findOne({ _id: users._id });

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

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    await connectDB(); // Connect to the database

    // Find the user with the provided email
    const user = await User.findOne({ email: credentials.email });

    // Check if the user exists and if the password matches

    // Return the user if login is successful
    return user;
  } catch (error: any) {
    throw new Error(`Failed to login user: ${error.message}`);
  }
}
