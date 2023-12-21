import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice, getHighestPrice } from "../utils";
import { extractDescription } from "../utils/index";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // Bright Data proxy configuration

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const option = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: `brd.superproxy.io`,
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, option);
    const $ = cheerio.load(response.data);

    // extract the product data
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $("span.a-offscreen"),
      $("span.a-price-whole"),
      $("span.a-price-decimal"),
      $("span.a-price-friction")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() || "out of stock";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const description = extractDescription($);
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    // construct data object

    const data = {
      url,
      title,
      currency: currency || "$",
      image: imageUrls[0],
      currentPrice: Number(currency) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape the product ${error.message}`);
  }
}
