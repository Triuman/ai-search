import axios from "axios";

type CustomSearchResult = {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap: unknown;
  mime: string;
  fileFormat: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
  labels: [
    {
      name: string;
      displayName: string;
      label_with_op: string;
    }
  ];
};

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
};

export async function getGoogleSearchResults({
  query,
}: {
  query: string;
}): Promise<SearchResult[]> {
  console.log("Searching for", query);

  const endpoint = "https://www.googleapis.com/customsearch/v1";
  const params = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.SEARCH_ENGINE_ID,
    q: query,
  };

  let response = await axios.get(endpoint, { params });
  return (response.data.items as CustomSearchResult[]).map((item) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    displayLink: item.displayLink,
  }));
}
