import { expect } from "chai";
import fs from "fs";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Chrome testing", () => {
    var browser: Browser;
    var page: Page;
    let constBrowser: Browser; // REVIEW: What??

    // Puppeteer options
    const opts = {
        args: [
            "--no-sandbox"
        ],
        devtools: true,
        headless: false,
        slowMo: 100,
        timeout: 10000
    };
    // NOTE: Timeout for mocha is capped at 2000ms. This much be overridden with .timeout(n) after the arrow function
    // expose variables
    before (async () => {
        browser = await puppeteer.launch(opts);
        let content: string = fs.readFileSync(__dirname + "/../helperfiles/testPage.html", "utf-8");
        page = await browser.newPage();
        await page.goto(`data:text/html,` + content, { waitUntil: "networkidle2" });
        // await page.setContent(content); // BUG: Not waiting for the page content to be loaded
    });
    
    it("should be started and running", async () => {
        await page.on("console", (msg) => {
            expect(msg.text()).equals("Engine started");
        });
    });

    it("should have a canvas element attached from the render system", () => {
        page.evaluate(() => {

        });
    });

    // close browser and reset global variables
    after (() => {
        browser.close();
        browser = constBrowser;
    });
});