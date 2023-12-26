"use server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../database/mongoose";
import Product from "../model/product.model";
import { scrapeNaverData } from "../scraper";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(restaurantUrl: string) {
  if (!restaurantUrl) return;

  try {
    // connectDB();

    await scrapeNaverData(restaurantUrl);

    // if (!scrapedProduct) return;

    // let product = scrapedProduct;

    // const existingProduct = await Product.findOne({ url: scrapedProduct.url });

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

export async function getProductById(productId: string) {
  try {
    connectDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectDB();
    const products = await Product.find();

    return products;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
