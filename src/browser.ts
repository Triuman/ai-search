import axios from "axios";
import { AxiosError } from "axios";
import { load } from "cheerio";
import * as htmlToText from "html-to-text";

export async function getCleanedWebpage({ url }: { url: string }) {
  try {
    const response = await axios.get(url);

    const $ = load(response.data);

    // Example: Remove any <script>, <style>, or <aside> elements
    $("script, style").remove();

    // Convert remaining HTML to text
    return htmlToText
      .htmlToText($.html(), {
        wordwrap: false,
      })
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
      const errorText =
        "" +
        (error as AxiosError).response?.status +
        (error as AxiosError).response?.statusText;

      console.log("Error while getting webpage" + errorText);

      return "Error while getting webpage" + errorText;
    }

    console.log("Error while getting webpage", error);

    return "Error while getting webpage";
  }
}
