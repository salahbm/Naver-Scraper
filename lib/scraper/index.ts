"use server";
import puppeteer from "puppeteer";

const result: any = {};

export async function scrapeNaverData(searchName: string): Promise<any> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 10000 });
  await page.goto("https://map.naver.com/v5/search/" + searchName);
  wait(1);

  let frame: any | null;

  // Set up a timer to close the browser if there are no search results
  const timer = setTimeout(() => {
    browser.close();
  }, 5000);

  // Check if there are search results
  try {
    await page.waitForSelector("#entryIframe", { timeout: 60000 });

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

  wait(1);

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

  // Extract text content from the element handles
  const name = await frame.evaluate((el: any) => el.innerText, handleName);
  const category = await frame.evaluate(
    (el: any) => el.innerText,
    handleCategory
  );
  const address = await frame.evaluate(
    (el: any) => el.innerText,
    handleAddress
  );
  const phone = await frame.evaluate((el: any) => el.innerText, handlePhone);
  if (!handleSocials) {
    console.log("No Socials Link");
    browser.close();
    return;
  }

  const socialLinks = await frame.evaluate((element: HTMLBodyElement) => {
    const links = Array.from(element.querySelectorAll("a"));
    return links.map((link: any) => link.href);
  }, handleSocials);

  // Check if there is menu information
  const menuBtn = await frame.$eval(
    ".flicking-camera > a:nth-child(2) > span",
    (el: any) => el.innerText
  );
  if (menuBtn !== "메뉴") {
    console.log("no menu btn.");
    browser.close();
    return;
  }

  // Click on the 'Menu' button
  await frame.click(".flicking-camera > a:nth-child(2)");

  // Wait for the menu container to be present
  const handleMenu = await frame.waitForSelector(
    "#app-root > div > div > div > div:nth-child(6) > div > div:nth-child(2) > div > ul" ||
      "#app-root > div > div > div > div:nth-child(6) > div:nth-child(2) > div.place_section.no_margin > div > ul"
  );

  if (!handleMenu) {
    console.log("No Menu List");
    browser.close();
    return;
  }

  // Extract menu data
  const menu = await getMenu(
    ".VQvNX",
    ".gl2cc",
    ".place_thumb img",
    handleMenu
  );

  // get Logo
  await frame.click(".flicking-camera > a:nth-child(4)");
  const logoSelector = ".wzrbN a.place_thumb img#업체_0";
  const handleLogo = await frame.waitForSelector(logoSelector);
  const logo = await frame.evaluate(
    (img: any) => img.getAttribute("src"),
    handleLogo
  );
  const data: any = {
    logo,
    name,
    category,
    address,
    phone,
    socialLinks,
    menu,
  };

  browser.close();
  return data;
}

async function wait(sec: number) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}

async function getMenu(
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
