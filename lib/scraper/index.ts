"use server";
import puppeteer from "puppeteer";

// Function to wait for a specified number of seconds
function wait(sec: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

// Function to extract menu information using Cheerio
async function getMenu(
  nameClass: string,
  priceClass: string,
  ul: any
): Promise<any[]> {
  const arr = [];
  const allName = await ul.$$(nameClass);
  const allPrice = await ul.$$(priceClass);

  for (let i = 0; i < allName.length; i++) {
    const name = await allName[i].evaluate((n: any) => n.innerText);
    const price = await allPrice[i].evaluate((p: any) => p.innerText);
    arr.push({
      name,
      price,
    });
  }

  return arr;
}

export async function scrapeNaverData(searchName: string): Promise<void> {
  if (!searchName) return;

  // Puppeteer and Cheerio logic
  const result: any = {};
  let menu: any[] = [];

  try {
    const browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1000,
      height: 10000,
    });
    await page.goto("https://map.naver.com/v5/search/" + searchName);

    // Wait for 1 second
    await wait(1);

    let frame: any;

    // Set up a timer to close the browser if there are no search results
    const timer = setTimeout(() => {
      browser.close();
    }, 5000);

    // Check if there are search results
    try {
      frame = await page.waitForSelector('iframe[name="entryIframe"]');
      clearTimeout(timer);
    } catch {
      console.log(searchName + " No search results found.");
      result[searchName] = [];
      return;
    }

    // Wait for 1 second
    await wait(1);

    // Check if there is menu information
    const menuBtn = await frame.$eval(
      ".flicking-camera > a:nth-child(2) > span",
      (el: any) => el.innerText
    );
    if (menuBtn !== "메뉴") {
      console.log("No 'Menu' button found.");
      result[searchName] = [];
      browser.close();
      return;
    }

    // Click on the 'Menu' button
    await frame.click(".flicking-camera > a:nth-child(2)");

    // Click on the 'See More' button if available
    try {
      await frame.click(
        "#app-root > div > div > div > div:nth-child(7) > div > div.place_section.no_margin > div.lfH3O > a"
      );
    } catch (error) {
      console.log('No "See More" button found.');
      let ul;

      // Handle the case where the menu information is in a different class for places that support ordering on Naver
      try {
        ul = await frame.waitForSelector(".ZUYk_");
        menu = await getMenu(".Sqg65", ".SSaNE", ul);
      } catch (error) {
        ul = await frame.waitForSelector(".list_place_col1");
        menu = await getMenu(".name", ".price", ul);
      }
    }

    // Close the browser
    browser.close();
    result[searchName] = menu;
    console.log(result);
  } catch (error: any) {
    // Handle errors
    throw new Error(`Failed to scrape the product ${error.message}`);
  }
}
