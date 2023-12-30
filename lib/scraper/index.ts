"use server";
import puppeteer, { trimCache } from "puppeteer";
import {
  getKeywords,
  getLogo,
  getMenu,
  getVisitorsReview,
  wait,
} from "./helperFunctions";

export async function scrapeNaverData(searchName: string): Promise<any> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://map.naver.com/v5/search/" + searchName);
  wait(1);

  let frame: any | null;

  // Set up a timer to close the browser if there are no search results
  const timer = setTimeout(() => {
    browser.close();
  }, 5000);

  // Check if there are search results
  try {
    await page.waitForSelector("#entryIframe", { timeout: 30000 });

    const iframeHandle: any | null = await page.$("#entryIframe");
    if (!iframeHandle) {
      throw new Error("iframe element not found.");
    }

    frame = await iframeHandle.contentFrame();
    clearTimeout(timer);
  } catch {
    console.log(searchName + " iframe not found.");
    browser.close();
    return;
  }

  wait(2);

  // handle restaurant info
  const handleName = await frame.$("#_title > div > span.Fc1rA");
  const handleCategory = await frame.$("#_title > div > span.DJJvD");
  const handleAddress = await frame.$(
    "#app-root > div > div > div > div:nth-child(5) > div > div:nth-child(2) > div.place_section_content > div > div.O8qbU.tQY7D > div > a > span.LDgIH"
  );
  const handlePhone = await frame.$(
    "#app-root > div > div > div > div:nth-child(5) > div > div:nth-child(2) > div.place_section_content > div > div.O8qbU.nbXkr > div > span.xlx7Q"
  );
  const handleSocials = await frame.$(
    "#app-root > div > div > div > div:nth-child(5) > div > div:nth-child(2) > div.place_section_content > div > div.O8qbU.yIPfO > div > div"
  );
  const handleVisitorsReview = await frame.$(
    "#app-root > div > div > div > div.place_section.no_margin.OP4V8 > div.zD5Nm.undefined > div.dAsGb > span:nth-child(1) > a"
  );
  const handleBLogReview = await frame.$(
    "#app-root > div > div > div > div.place_section.no_margin.OP4V8 > div.zD5Nm.undefined > div.dAsGb > span:nth-child(2) > a"
  );
  wait(1);

  // Extract text content from the element handles
  const name = handleName
    ? await frame.evaluate((el: any) => el.innerText, handleName)
    : "not available";

  const category = handleCategory
    ? await frame.evaluate((el: any) => el.innerText, handleCategory)
    : "not available";

  const address = handleAddress
    ? await frame.evaluate((el: any) => el.innerText, handleAddress)
    : "not available";

  const phone = handlePhone
    ? await frame.evaluate((el: any) => el.innerText, handlePhone)
    : "not available";

  // Check if handleVisitorsReview exists before trying to use it
  const visitorsReview = handleVisitorsReview
    ? await frame.evaluate((el: any) => el.innerText, handleVisitorsReview)
    : "not available";

  // Check if handleBLogReview exists before trying to use it
  const blogReview = handleBLogReview
    ? await frame.evaluate((el: any) => el.innerText, handleBLogReview)
    : "not available";

  if (!handleSocials) {
    console.log("No Socials Link");
  }

  const socialLinks = handleSocials
    ? await frame.evaluate((element: HTMLBodyElement) => {
        const links = Array.from(element.querySelectorAll("a"));
        return links.map((link: any) => link.href);
      }, handleSocials)
    : ["not available"];

  // Check if there is menu information
  // const menuBtn = await frame.$eval(
  //   ".flicking-camera > a:nth-child(2) > span",
  //   (el: any) => el.innerText
  // );
  // let menu;
  // if (menuBtn !== "메뉴") {
  //   console.log("no menu btn.");
  //   menu = "not available";
  // } else {
  //   // Click on the 'Menu' button
  //   await frame.click(".flicking-camera > a:nth-child(2)");

  //   // Wait for the menu container to be present
  //   const handleMenu = await frame.waitForSelector(
  //     "#app-root > div > div > div > div:nth-child(6) > div > div:nth-child(2) > div > ul" ||
  //       "#app-root > div > div > div > div:nth-child(6) > div:nth-child(2) > div.place_section.no_margin > div > ul"
  //   ,   { timeout: 10000 });

  //   if (!handleMenu) {
  //     console.log("No Menu List");
  //     menu = "not available";
  //   } else {
  //     // Extract menu data
  //     menu = handleMenu
  //       ? await getMenu(".VQvNX", ".gl2cc", ".place_thumb img", handleMenu)
  //       : ["not available"];
  //   }
  // }

  // get Logo
  const logo = await getLogo(frame);

  // get Visitors Review
  let reviews;
  try {
    reviews = await getVisitorsReview(frame);
  } catch (error: any) {
    console.log("Error in getVisitorsReview: ", error.message);
  }

  // get keywords
  let trendingKeywords;
  try {
    trendingKeywords = await getKeywords(page, searchName);
  } catch (error: any) {
    console.log(error.message);
  }

  const data: any = {
    logo,
    name,
    category,
    address,
    phone,
    socialLinks,
    // menu,
    visitorsReview,
    blogReview,
    reviews,
    trendingKeywords,
  };

  browser.close();
  return data;
}
