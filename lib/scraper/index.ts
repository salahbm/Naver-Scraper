import puppeteer from "puppeteer";
import cheerio from "cheerio";

export async function scrapeNaverData(url: string) {
  if (!url) return;

  try {
    // Launch Puppeteer and create a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Get the HTML content of the page
    const htmlContent = await page.content();

    // Extracting data logic starts here
    let index = 0;
    const csvContent = ""; // Replace with your CSV content

    // Split CSV content into rows
    const csvRows = csvContent.split("\r\n");

    for (const row of csvRows) {
      // Extracting data from CSV row
      const split = row.split(",");
      const storeName = split[1];
      const storeType = split[2];
      const storeAddress = split[6];

      if (storeType === "20") {
        continue;
      }

      console.log(storeName + " " + storeAddress);

      const searchName = storeName + " " + storeAddress;

      // Run Puppeteer logic for each entry
      if (index > 1) {
        // Extract store data using Puppeteer and Cheerio
        const restaurantData = await processStoreData(searchName, htmlContent);
        console.log(restaurantData); // Adjust as needed
      }

      index++;
    }
    // Extracting data logic ends here

    // Close the Puppeteer browser
    await browser.close();

    // Return any relevant data
    return {};
  } catch (error: any) {
    // Handle errors
    throw new Error(`Failed to scrape the product ${error.message}`);
  }
}

async function processStoreData(searchName: string, htmlContent: any) {
  // Use Cheerio to load the HTML content
  const $ = cheerio.load(htmlContent);
  try {
    const restaurantData = {
      name: $(".name-selector").text().trim(),
      // Add more data extraction logic here
    };

    return restaurantData;
  } catch (error: any) {
    console.error(
      `Error processing store data for ${searchName}: ${error.message}`
    );
    return {}; // Return an empty object or handle the error as needed
  }
}
