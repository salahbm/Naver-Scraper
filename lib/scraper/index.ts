import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

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
      $("span.a-offscreen")
      //   $("span.price-a-whole"),
      //   $("span.a-price-friction")
    );
    console.log(currentPrice);
  } catch (error: any) {
    throw new Error(`Failed to scrape the product ${error.message}`);
  }
}
