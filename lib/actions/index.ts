"use server";
import { UserType } from "@/types";
import { connectDB } from "../database/mongoose";
import { scrapeNaverData } from "../scraper";
import { User } from "../model/user.model";
import { redirect } from "next/dist/server/api-utils";
import { revalidatePath } from "next/cache";

interface RestaurantData {
  logo: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  result: any;
  socialLinks: string[];
  menu: any[];
}

export async function scrapeAndStoreProduct(restaurantUrl: string) {
  if (!restaurantUrl) return;

  try {
    // connectDB();

    const existingData: RestaurantData[] = JSON.parse(
      localStorage.getItem("storedData") || "[]"
    );

    const scrapeData = await scrapeNaverData(restaurantUrl);

    const isExistingData = existingData.find(
      (data) => data.phone.trim() === scrapeData.phone.trim()
    );

    if (!isExistingData) {
      // Add new data to the array
      existingData.push(scrapeData);

      // Save the updated array back to local storage
      localStorage.setItem("storedData", JSON.stringify(existingData));
    } else {
      console.log(`Data for ${scrapeData.name} already exists. Not saving.`);
    }

    // const existingProduct = await Product.findOne({ url: scrapeData.url });

    // if (existingProduct) {
    //   const updatedPriceHistory: any = [
    //     ...existingProduct.priceHistory,

    //   ];

    //   product = {

    //   };
    // }

    // const newProduct = await Product.findOneAndUpdate(

    // );

    // revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

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
