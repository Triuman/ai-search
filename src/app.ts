require("dotenv").config();

import { onUserMessage } from "./openai";
import { launchBrowser } from "./puppeteer";

launchBrowser().then(() => {
  console.log("Browser launched");
});

// Usage:
// getGoogleSearchResults("google custom search api pricing").then((results) => {
//   console.log(results);
// });

// getCleanedWebpage(
//   "https://developers.google.com/custom-search/v1/overview"
// ).then((text) => {
//   console.log(text);
// });

// getModels().then((models) => {
//   console.log(models);
// });

import * as readline from "readline";

const readlineInstance = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the OpenAI chatbot!");
console.log("Ask me anything!");

function readUserInput() {
  readlineInstance.question("\n", async (question: string) => {
    const response = await onUserMessage(question);

    console.log("agent:", response);

    readUserInput();
  });
}

readUserInput();

// import * as cheerio from "cheerio";
// import * as htmlToText from "html-to-text";

// openUrl(
//     "https://www.google.com/search?q=apple+stock&rlz=1C1ONGR_deDE960DE960&oq=apple+stock&aqs=chrome.0.69i59j0i512l4j69i61l3.4796j1j7&sourceid=chrome&ie=UTF-8"
//   ).then((html) => {
//     const $ = cheerio.load(html);

//     // Example: Remove any <script>, <style>, or <aside> elements
//     $("script, style").remove();

//     // $("input, button").each(function (i, elem) {
//     //   $(this).replaceWith(`{{element_${i}}}`);
//     // });

//     // Convert remaining HTML to text
//     const textContent = htmlToText
//       .htmlToText($.html(), {
//         wordwrap: false,
//       })
//       .replace(/\s+/g, " ")
//       .trim();

//     console.log(textContent);
//   });
