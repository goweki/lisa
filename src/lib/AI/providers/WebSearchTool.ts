import { ToolDecorator } from "../decorators/ToolDecorator";
import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";

// Ensure you have the API key set in your environment variables
const SERPAPI_KEY = process.env.SERPAPI_KEY!;
const SERPAPI_URL = "https://serpapi.com/search";

export class WebSearchTool {
  @ToolDecorator({
    docstring: `Performs a web search using Google and summarizes the top 5 results.

Parameters:
- query: The search query to look up information.`,
    parameters: {
      query: { type: "string", description: "Search query for the web search" },
    },
  })
  async searchWeb(query: string): Promise<string> {
    try {
      const searchResponse = await axios.get(SERPAPI_URL, {
        params: {
          q: query,
          api_key: SERPAPI_KEY,
          num: 5, // Fetch top 5 results
        },
      });

      const results = searchResponse.data.organic_results;
      if (!results || results.length === 0) {
        return "No relevant results found.";
      }

      // Fetch summaries for all 5 search results
      let summaries: string[] = [];
      for (const result of results.slice(0, 5)) {
        // Limit to top 5 results
        if (!result.link) continue; // Skip if no link is available

        console.log(`Fetching content from: ${result.link}`);

        const summary = await this.summarizeWebPage(result.link);
        summaries.push(
          `**${result.title}**\n${summary}\n[Read more](${result.link})\n`
        );
      }

      // Join all summaries into a structured response
      return `### Web Search Summary:\n\n` + summaries.join("\n---\n");
    } catch (error) {
      console.error("Error:", error);
      return `Error fetching search results.`;
    }
  }

  /**
   * Fetches and summarizes content from a webpage.
   * Uses cheerio to extract readable text and limit its length.
   */
  private async summarizeWebPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { timeout: 8000 }); // Fetch webpage content
      const html = response.data; // Get raw HTML as string
      const $ = cheerio.load(html); // Load HTML into Cheerio

      // Extract readable text from <p> elements
      let pageTextArray: string[] = [];
      $("p").each((index, element) => {
        const paragraphText = $(element).text().trim();
        if (paragraphText.length > 50) {
          // Ignore very short paragraphs (e.g., ads, navigation)
          pageTextArray.push(paragraphText);
        }
      });

      // Join extracted text into a single summary
      let pageText = pageTextArray.join(" ");

      if (!pageText || pageText.length < 100) {
        return "No substantial content found.";
      }

      // Limit the output to the first 1000 characters
      return pageText.substring(0, 1000) + "...";
    } catch (error) {
      console.error(`Failed to fetch/summarize page: ${url}`, error);
      return "Error retrieving page summary.";
    }
  }
}
