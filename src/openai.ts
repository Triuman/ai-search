import OpenAI from "openai";
import { PagePromise } from "openai/core.mjs";
import { getGoogleSearchResults } from "./googleSearch";
import { getWebpageTextContent } from "./puppeteer";

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
  organization: "org-JiB2kTrxmxsvRKp6D5Yo8XdP",
});

export function getModels(): PagePromise<
  OpenAI.ModelsPage,
  OpenAI.Models.Model
> {
  return openai.models.list();
}

const functions: { [name: string]: (...args: any[]) => Promise<any> } = {};

functions["getCleanedWebpage"] = getWebpageTextContent;
functions["getGoogleSearchResults"] = getGoogleSearchResults;

const functionDescriptions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[] =
  [
    {
      name: "getCleanedWebpage",
      description: "Gets the text content of a webpage",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The url of the webpage to get the text content of",
          },
        },
        required: ["url"],
      },
    },
    {
      name: "getGoogleSearchResults",
      description: "Gets the top 10 Google search results for a query",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",

            description: "The query to search for",
          },
        },
        required: ["query"],
      },
    },
  ];

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `You are a very helpful and thoughtful chatbot who has access to two functions that can help you answer questions.
      One function is called getCleanedWebpage and it takes a url as an argument.
      The other function is called getGoogleSearchResults and it takes a query as an argument.
      You can call these functions by typing their names and passing in the appropriate arguments.
      Never ask users to visit a website themselves to reach the answer. Find the answer for them.
      Use different search queries if necessary.`,
  },
];

function chat(newMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam) {
  messages.push(newMessage);

  console.log("sending new message to openai", newMessage);

  return openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-16k",
      messages,
      functions: functionDescriptions,
    })
    .then((response) => {
      messages.push(response.choices[0].message);

      return response.choices[0].message;
    })
    .catch((error) => {
      console.log("error while creating chat result", error);

      return null;
    });
}

export async function onUserMessage(message: string): Promise<string | null> {
  let agentResponse = await chat({
    role: "user",
    content: message,
  });

  console.log(agentResponse);

  if (!agentResponse) {
    return null;
  }

  let functionCall = agentResponse.function_call;

  while (functionCall) {
    agentResponse = await onFunctionCallRequest(functionCall);

    console.log(agentResponse);

    if (!agentResponse) {
      return null;
    }

    if (agentResponse?.function_call) {
      functionCall = agentResponse.function_call;
    } else {
      functionCall = undefined;
    }
  }

  return agentResponse.content;
}

function clearPrevFunctionCallResponses() {
  // replace the function call content with a placeholder
  messages.forEach((message) => {
    if (message.role === "function") {
      message.content = "prev function call. removed for brevity.";
    }
  });
}

async function onFunctionCallRequest(
  functionCall: OpenAI.Chat.Completions.ChatCompletionMessage.FunctionCall
) {
  clearPrevFunctionCallResponses();

  const functionName = functionCall.name;
  const functionArgs = JSON.parse(functionCall.arguments);

  console.log("functionName", functionName);
  console.log("functionArgs", functionArgs);

  const functionToCall = functions[functionName];

  if (!functionToCall) {
    return chat({
      role: "function",
      content: `Sorry, I don't know how to call ${functionName}`,
      name: functionName,
    });
  }

  const result = await functionToCall(functionArgs);

  const resultShortened = result.slice(0, 18000);

  console.log("resultShortened", resultShortened);

  return chat({
    role: "function",
    content: JSON.stringify(resultShortened),
    name: functionName,
  });
}
