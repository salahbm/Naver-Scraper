"use server";
import puppeteer, { Page } from "puppeteer";
// get chosen iframe
export const getIframeFromSearch = async (searchPrompt: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  if (!page) return;
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://map.naver.com/v5/search/" + searchPrompt, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  let searchFrame: any | null;

  try {
    await page.waitForFunction(
      () => document.querySelector("#searchIframe") !== null,
      { timeout: 60000 }
    );

    const iframeHandle: any | null = await page.$("#searchIframe");
    if (!iframeHandle) {
      throw new Error("iframe element not found.");
    }

    searchFrame = await iframeHandle.contentFrame();
  } catch (error) {
    console.log(searchPrompt + " iframe not found.", error);
    return;
  }

  // Function to scroll the div element
  const scrollDiv = async () => {
    await searchFrame.evaluate(() => {
      const divElement = document.querySelector(".Ryr1F");
      if (divElement) {
        divElement.scrollTop += 2000; // Adjust the scroll amount as needed
      }
    });
    await wait(1); // Wait for 1 second after scrolling
  };

  let liElements;
  for (let i = 0; i < 5; i++) {
    await scrollDiv();
    liElements = await searchFrame.$$eval("li", (lis: any) => {
      return lis.map((li: any) => {
        const linkElement = li.querySelector("a.tzwk0");
        const titleElement = li.querySelector("span.TYaxT");
        const locationElement = li.querySelector("span.Pb4bU");
        const typeElement = li.querySelector("span.KCMnt");
        const distanceElement = li.querySelector("span.lWwyx.NVngW");

        const link = linkElement?.getAttribute("href") || "";
        const title = titleElement?.textContent || "";
        const location = locationElement?.textContent || "";
        const type = typeElement?.textContent || "";
        const distance = distanceElement?.textContent || "";

        return { link, title, location, type, distance };
      });
    });
  }
  console.log(`file: helperFunctions.ts:71 ~ liElements:`, liElements);
  browser.close();
  return liElements;
};

// get visitors review
export const getVisitorsReview = async (frame: any) => {
  const arr: any[] = [];

  // handle whether blog exists or not
  let reviewBtn = await frame.$eval(
    ".flicking-camera > a:nth-child(4) > span",
    (el: any) => el.innerText
  );

  if (reviewBtn === "리뷰") {
    // Click on the fourth child (in this case) of .flicking-camera
    await frame.click(".flicking-camera > a:nth-child(4)");
  } else {
    // Click on the 3rd child (in this case) of .flicking-camera
    await frame.click(".flicking-camera > a:nth-child(3)");
  }

  await frame.click(
    "#app-root > div > div > div > div:nth-child(6) > div.jGeXd > div > a:nth-child(1)"
  );

  // load all reviews
  let moreBtn;
  do {
    const btnSelector =
      "#app-root > div > div > div > div:nth-child(6) > div:nth-child(3) > div.place_section.no_margin.mdJ86 > div > div > div.k2tmh > a.Tvx37";
    await frame.waitForSelector(btnSelector, { timeout: 10000 });
    await frame.click(btnSelector);
    moreBtn = await frame.$(btnSelector);
  } while (moreBtn);

  // Scrape the data from handle logic
  await wait(1);
  // Wait for the reviews container to appear

  await frame.waitForSelector(".uNsI9");

  // Get all the review items
  const reviewItems = await frame.$$(".uNsI9 li");

  if (reviewItems.length === 0) {
    return [];
  }
  // Iterate over each review item
  for (const reviewItem of reviewItems) {
    // Extract the review name
    const reviewName = await reviewItem.$eval(
      ".nWiXa",
      (el: HTMLElement) => el.innerText
    );

    // Extract the review count
    const reviewCount = await reviewItem.$eval(".TwM9q", (el: HTMLElement) => {
      const countText = el.innerText.replace(/\D/g, "");
      return parseInt(countText, 10);
    });

    // Push the review name and count to the reviews array
    arr.push({ type: reviewName, count: reviewCount });
  }

  return arr;
};

// Get logo

export async function getLogo(frame: any) {
  let logo;
  let logoBtn = await frame.$eval(
    ".flicking-camera > a:nth-child(4) > span",
    (el: any) => el.innerText
  );

  if (logoBtn === "사진") {
    // Click on the fourth child (in this case) of .flicking-camera
    await frame.click(".flicking-camera > a:nth-child(4)");
  } else {
    // Click on the fifth child (in this case) of .flicking-camera
    await frame.click(".flicking-camera > a:nth-child(5)");
  }

  const logoSelector = "#업체_0";
  const handleLogo = await frame.waitForSelector(logoSelector, {
    timeout: 10000,
  });

  // Check if handleLogo exists before trying to use it
  logo = handleLogo
    ? await frame.evaluate((img: any) => img.getAttribute("src"), handleLogo)
    : "not available";

  if (logo === "not available") {
    console.log("No suitable logo button found.");
  }
  return logo;
}

// go to naver to get trending keywords
export const getKeywords = async (page: Page, searchPrompt: string) => {
  if (!page) return;
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.naver.com/");
  wait(1);

  // Input searchPrompt
  const searchFirstWord = searchPrompt.split(" ");
  await page.keyboard.type(searchFirstWord[0]);
  await page.click(`#sform > fieldset >  button`);

  // Wait for the related keywords section
  const relatedSearch = await page.waitForSelector(
    "#nx_right_related_keywords",
    { timeout: 10000 }
  );

  let keywords: string[] = [];

  if (relatedSearch) {
    // Adjust the selector for liItems
    const liItems = await page.$$("#nx_right_related_keywords .item");

    if (liItems.length === 0) return [];

    for (const liItem of liItems) {
      // Use $eval on page, not liItem, and adjust the selector
      const keywordName = await page.$eval(
        ".tit", // Adjust the selector to match the structure of your HTML
        (el: any) => el.innerText
      );
      keywords.push(keywordName);
    }

    return keywords;
  } else {
    return [];
  }
};

// Get Menu

export async function getMenu(
  nameClass: string,
  priceClass: string,
  imgClass: string,
  ul: any
): Promise<any[]> {
  const arr: any[] = [];

  const allName = await ul.$$(nameClass);
  const allPrice = await ul.$$(priceClass);
  const allImages = await ul.$$(imgClass);

  for (const elementHandle of allName) {
    const name = await elementHandle.evaluate((n: any) => n.innerText);
    const priceElementHandle = allPrice[allName.indexOf(elementHandle)];
    const imgElementHandle = allImages[allName.indexOf(elementHandle)];
    const imageUrl = await imgElementHandle.evaluate((img: any) =>
      img.getAttribute("src")
    );
    const price = await priceElementHandle.evaluate((p: any) => p.innerText);
    arr.push({ name, price, imageUrl });
  }

  return arr;
}
export async function wait(sec: number) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}
