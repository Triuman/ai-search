require("dotenv").config();

import { onUserMessage } from "./openai";
import { launchBrowser } from "./puppeteer";

launchBrowser().then(() => {
  //   console.log("Browser launched");
});

import * as readline from "readline";

const readlineInstance = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the OpenAI chatbot!");
console.log("Ask me anything!");

function readUserInput() {
  readlineInstance.question("\n", async (question: string) => {
    console.log("\n");

    const response = await onUserMessage(question);

    readUserInput();
  });
}

readUserInput();
