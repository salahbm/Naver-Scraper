// Import necessary modules
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// Define the CSV file name and path
const file_name = "text.csv";
const file_path = path.join(__dirname, file_name);

console.log(file_path);

// Read the content of the CSV file
const csv = fs.readFileSync(file_path, "utf-8");
// Split CSV content into rows
const rows = csv.split("\r\n");

// Initialize the scraping process
init(rows);

// Function to initialize the scraping process
async function init(rows) {
    let index = 0;

    // Iterate through each row of the CSV file
    for (const row of rows) {
        // Extract relevant data from the CSV row
        const split = row.split(",");
        const storeName = split[1];
        const storeType = split[2];
        const storeAddress = split[6];

        // Skip processing for storeType "20"
        if (storeType === "20") {
            continue;
        }

        // Log storeName and storeAddress to the console
        console.log(storeName + " " + storeAddress);

        const searchName = storeName + " " + storeAddress;

        // Run Puppeteer logic for each entry after the first row
        if (index > 0) {
            await searchPuppeteer(searchName);
        }

        index++;
    }
}

// Puppeteer and Cheerio logic
const result = {};

// Function to perform Puppeteer search
async function searchPuppeteer(searchName) {
    const browser = await puppeteer.launch({
        headless: false // Set to true for headless mode
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 10000
    });
    await page.goto("https://map.naver.com/v5/search/" + searchName);

    // Wait for 1 second
    wait(1);

    let frame;

    // Set up a timer to close the browser if there are no search results
    const timer = setTimeout(() => {
        browser.close();
    }, 5000);

    // Check if there are search results
    try {
        frame = await page.waitForFrame(async frame => {
            return frame.name() === 'entryIframe';
        });
        clearTimeout(timer);
    } catch {
        console.log(searchName + ' No search results found.');
        result[searchName] = [];
        return;
    }

    // Wait for 1 second
    wait(1);

    // Check if there is menu information
    const menuBtn = await frame.$eval('.flicking-camera > a:nth-child(2) > span', el => el.innerText);
    if (menuBtn !== '메뉴') {
        console.log("No 'Menu' button found.");
        result[searchName] = [];
        browser.close();
        return;
    }

    // Click on the 'Menu' button
    await frame.click('.flicking-camera > a:nth-child(2)');

    // Click on the 'See More' button if available
    try {
        await frame.click('#app-root > div > div > div > div:nth-child(7) > div > div.place_section.no_margin > div.lfH3O > a');
    } catch (error) {
        console.log('No "See More" button found.');
        let ul;

        // Handle the case where the menu information is in a different class for places that support ordering on Naver
        try {
            ul = await frame.waitForSelector('.ZUYk_');
            menu = await getMenu('.Sqg65', '.SSaNE', ul);
        } catch (error) {
            ul = await frame.waitForSelector('.list_place_col1');
            menu = await getMenu('.name', '.price', ul);
        }
    }

    // Close the browser
    browser.close();
    result[searchName] = menu;
    console.log(result);
}

// Function to wait for a specified number of seconds
function wait(sec) {
    let start = Date.now(),
        now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}

// Function to extract menu information using Cheerio
async function getMenu(nameClass, priceClass, ul) {
    const arr = [];
    const allName = await ul.$$(nameClass);
    const allPrice = await ul.$$(priceClass);
    for (const i in allName) {
        const name = await allName[i].evaluate(n => n.innerText);
        const price = await allPrice[i].evaluate(p => p.innerText);
        arr.push({
            name,
            price
        });
    }
    return arr;
}