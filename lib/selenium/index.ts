"use server";
import { Builder, By, until } from "selenium-webdriver";

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default async function navigateNaverMap(searchedPrompt: string) {
  let driver;

  try {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();

    // Open Naver Map
    await driver.get("https://map.naver.com/");
    await sleep(500);
    // Find and interact with the search input field
    const searchInput = await driver.findElement(By.className("input_search"));
    await searchInput.click();
    await sleep(500);
    await searchInput.sendKeys(searchedPrompt);
    await searchInput.sendKeys("\uE007"); // Press Enter
    await sleep(500);
    // Wait for search results to load
    await driver.wait(until.elementLocated(By.className("lst_site")), 5000);

    // Click on the first search result link
    const firstSearchResult = await driver.findElement(
      By.css(".lst_site .item_tit a")
    );
    await firstSearchResult.click();
    await sleep(500);
    // Wait for the new page to load
    await driver.wait(until.stalenessOf(firstSearchResult), 5000);

    // Return the URL of the opened page
    const currentUrl = await driver.getCurrentUrl();
    return currentUrl;
  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
