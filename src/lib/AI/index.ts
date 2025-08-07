import { WebSearchTool } from "./providers/WebSearchTool"; // Import new tool
import { TaskTools } from "./providers/TaskTools";
import { ToolsManager } from "./agent/ToolsManager";
import { Agent } from "./agent/Agent";
import { GeminiLLMProvider } from "./llm/GeminiLLMProvider";
import { Content } from "@google/genai";
import { User, UserRole } from "@prisma/client";

export type CustomUser = User & {
  institutions: {
    id: string;
    name: string;
    role: UserRole;
  }[];
};

const dummyPrompt =
  "Find the latest trends in AI for 2025 specifically related to Large Language Models and summarize them search the web. Just return Json no additional text.";

export async function runAgent({
  user,
  prompt = dummyPrompt,
}: {
  user: CustomUser;
  prompt: Content[] | string;
}) {
  // --- Agent Initialization (happens on each request for simplicity, can be optimized) ---
  const searchProvider = new WebSearchTool();
  const taskProvider = new TaskTools();
  const searchTools = ToolsManager.registerToolsFrom(searchProvider);
  const taskTools = ToolsManager.registerToolsFrom(taskProvider);
  //
  // Initialize LLM Provider
  // Normalize the prompt
  const llmProvider = new GeminiLLMProvider();
  const agent = new Agent(llmProvider);
  // Register all tools with the agent
  [...searchTools, ...taskTools].forEach((tool) => agent.addTool(tool));
  // --- End Agent Initialization ---

  let finalResponse = "";

  // Step 1: Call LLM to determine if tools are needed
  const normalizedPrompt: Content[] =
    typeof prompt === "string"
      ? [{ role: "user", parts: [{ text: prompt }] }]
      : prompt;
  const initialLLMResponse = await agent.callLLM(normalizedPrompt, user);
  if (!initialLLMResponse.requires_tools) {
    console.log("Lisa AI DOES NOT require tools for this response");
    finalResponse =
      typeof initialLLMResponse === "string"
        ? initialLLMResponse
        : initialLLMResponse.direct_response || "";
  } else {
    console.log("Lisa AI requires tools");
    const toolResults: Record<string, string> = {};
    for (const toolCall of initialLLMResponse.tool_calls) {
      // Execute each tool call and store its result
      // Ensure proper error handling for tool execution in a real app
      try {
        toolResults[toolCall.tool] = await agent.useTool(
          toolCall.tool,
          toolCall.args
        );
      } catch (toolError: any) {
        console.error(`Error executing tool ${toolCall.tool}:`, toolError);
        toolResults[toolCall.tool] =
          `Error: ${toolError.message || "Tool execution failed"}`;
      }
    }

    // Step 2: Formulate a final prompt with tool outputs for summarization
    const finalPrompt = `
            User Query: ${prompt}

            Tool Outputs:
            ${JSON.stringify(toolResults, null, 2)}

            Instructions:
            1. Read and analyze the content in "Tool Outputs" section.
            2. For each result, generate a short response (2-3 sentences).
            3. Use clear, informative language. Do not generate any additional text beyond the required summaries.
            No tool usage required.
            Respond in JSON no additional text.

            Format:
            Actions taken:
            1. **[Action taken]** - (description)
            2. **[action taken]** - (description)

            Final Summary:
            (Concise summary of actions taken and steps moving forward)
        `;

    // Step 3: Call LLM again for final summarization
    const finalLLMResponse = await agent.callLLM(finalPrompt, user);
    console.log("Final response - ", finalLLMResponse);
    if (!finalLLMResponse.direct_response) {
      console.error("Could not generate final summary after tool use.");
    }
    finalResponse = finalLLMResponse.direct_response || "";
  }

  return finalResponse;
}
