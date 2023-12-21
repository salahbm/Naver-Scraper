"use server";

import { connectDB } from "../database/mongoose";
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectDB();
    const scrapeProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapeProduct) return;
  } catch (error: any) {
    throw new Error(`Failed to create the Product: ${error.message}`);
  }
}
