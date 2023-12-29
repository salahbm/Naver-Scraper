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
    await frame.waitForSelector(btnSelector);
    await frame.click(btnSelector);
    moreBtn = await frame.$(btnSelector);
  } while (moreBtn);

  // Scrape the data from handle logic
  await wait(1);
  // Wait for the reviews container to appear
  console.log("starting getting li");

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
    arr.push({ name: reviewName, count: reviewCount });
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
  const handleLogo = await frame.waitForSelector(logoSelector);

  // Check if handleLogo exists before trying to use it
  logo = handleLogo
    ? await frame.evaluate((img: any) => img.getAttribute("src"), handleLogo)
    : "not available";

  if (logo === "not available") {
    console.log("No suitable logo button found.");
  }
  return logo;
}

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
async function wait(sec: number) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}
