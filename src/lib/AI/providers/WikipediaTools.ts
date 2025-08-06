import { ToolDecorator } from "../decorators/ToolDecorator";
import axios from "axios";

export class WikipediaTools {
    @ToolDecorator({
        docstring: `Fetches a summary from Wikipedia for a given topic.

Parameters:
- topic: The title of the Wikipedia article to fetch.`,
        parameters: {
            topic: { type: "string", description: "Title of the Wikipedia article" },
        },
    })
    async fetchWikipediaSummary(topic: string): Promise<string> {
        try {
            const url = "https://en.wikipedia.org/w/api.php";
            const response = await axios.get(url, {
                params: {
                    action: "query",
                    prop: "extracts",
                    exintro: true,
                    explaintext: true,
                    format: "json",
                    origin: "*",
                    titles: topic,
                },
            });
            const pages = response.data.query.pages;
            const page = Object.values(pages)[0] as any;
            if (page && page.extract) {
                return page.extract;
            } else {
                return `No summary available for "${topic}".`;
            }
        } catch (error: any) {
            return `Error fetching Wikipedia summary: ${error.message}`;
        }
    }
}
