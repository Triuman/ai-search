## AI Search Engine

This is a basic implementation of a conversational search engine using GPT-4.
It is provided with 2 functions to search on Google and browse a url.

Requirements:
- Google API Key - https://console.cloud.google.com/apis/credentials
- Google Search Engine ID - https://programmablesearchengine.google.com/controlpanel/all
- OpenAI API Key - https://platform.openai.com/account/api-keys
- OpenAI Org ID - https://platform.openai.com/account/org-settings

Put those into an env file

```text
OPENAI_API_KEY=<API KEY HERE>
OPENAI_ORG_ID=<ORG ID HERE>
GOOGLE_API_KEY=<API KEY HERE>
SEARCH_ENGINE_ID=<SEARCH ENGINE ID HERE>
```

 and run

 `yarn`

 to install dependencies, and then

`yarn build && yarn start`

to run the program.
