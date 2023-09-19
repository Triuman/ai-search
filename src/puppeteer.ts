import puppeteer, { Browser } from "puppeteer-core";
import * as cheerio from "cheerio";
import * as htmlToText from "html-to-text";

let browser: Browser;

export async function launchBrowser() {
  browser = await puppeteer.launch({
    executablePath: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
    headless: false,
  });
}

async function openUrl(url: string): Promise<string> {
  const page = await browser.newPage();
  await page.goto(url);
  return await page.content();
}

export async function getWebpageTextContent({
  url,
}: {
  url: string;
}): Promise<string> {
  const html = await openUrl(url);

  const $ = cheerio.load(html);

  // Example: Remove any <script>, <style>, or <aside> elements
  $("script, style").remove();

  // Convert remaining HTML to text
  const textContent = htmlToText
    .htmlToText($.html(), {
      wordwrap: false,
    })
    .replace(/\s+/g, " ")
    .trim();

  console.log(textContent);

  return textContent;
}
