// Usage:
// getGoogleSearchResults("google custom search api pricing").then((results) => {
//   console.log(results);
// });

import { getModels, onUserMessage } from "./openai";

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
