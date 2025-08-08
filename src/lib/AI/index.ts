import { WebSearchTool } from "./providers/WebSearchTool"; // Import new tool
import { InstitutionTools } from "./providers/InstitutionTools";
import { UserTools } from "./providers/UserTools";
import { CaseTools } from "./providers/CaseTools";
import { TaskTools } from "./providers/TaskTools";
import { ToolsManager } from "./agent/ToolsManager";
import { Agent } from "./agent/Agent";
import { GeminiLLMProvider } from "./llm/GeminiLLMProvider";
import { Content } from "@google/genai";
import { User, UserRole } from "@prisma/client";
import { UserContext } from "./types/UserContext";
import { LLMResponse } from "./utils/createSystemPrompt";

const dummyPrompt =
  "Find the latest trends in AI for 2025 specifically related to Large Language Models and summarize them search the web. Just return Json no additional text.";

export async function runAgent({
  user,
  prompt = dummyPrompt,
}: {
  user: UserContext;
  prompt: Content[] | string;
}): Promise<string | null> {
  // --- Agent Initialization (happens on each request for simplicity, can be optimized) ---
  const institutionProvider = new InstitutionTools(user);
  const userProvider = new UserTools();
  const caseProvider = new CaseTools();
  const taskProvider = new TaskTools();
  const searchProvider = new WebSearchTool();

  const institutionTools = ToolsManager.registerToolsFrom(institutionProvider);
  const userTools = ToolsManager.registerToolsFrom(userProvider);
  const caseTools = ToolsManager.registerToolsFrom(caseProvider);
  const taskTools = ToolsManager.registerToolsFrom(taskProvider);
  const searchTools = ToolsManager.registerToolsFrom(searchProvider);

  //
  // Initialize LLM Provider
  // Normalize the prompt
  const llmProvider = new GeminiLLMProvider();
  const agent = new Agent(llmProvider);
  // Register all tools with the agent
  [
    ...institutionTools,
    ...userTools,
    ...caseTools,
    ...taskTools,
    ...searchTools,
  ].forEach((tool) => agent.addTool(tool));
  // --- End Agent Initialization ---

  let finalResponse: string | null = null;

  // Step 1: Call LLM to determine if tools are needed
  const normalizedPrompt: Content[] =
    typeof prompt === "string"
      ? [{ role: "user", parts: [{ text: prompt }] }]
      : prompt;
  const initialLLMResponse = await agent.callLLM(normalizedPrompt, user);

  console.log("Agent response from callLLM:", initialLLMResponse);

  if (!initialLLMResponse) {
    return null;
  }

  if (!initialLLMResponse.requires_tools) {
    console.log("Lisa AI DOES NOT require tools for this response");
    finalResponse = initialLLMResponse.direct_response || initialLLMResponse;
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
            Respond in JSON with no additional text, the direct response wshould be in the 'direct_response' attribute.

            Format:
            Actions taken:
            1. **[Action taken]** - (description)
            2. **[action taken]** - (description)

            Final Summary:
            (Concise summary of actions taken and steps moving forward)
        `;

    // Step 3: Call LLM again for final summary
    const finalLLMResponse = await agent.callLLM(finalPrompt, user);
    // if (!finalLLMResponse.direct_response) {
    //   console.error(
    //     "Could not generate final summary after tool use. No direct_response in:"
    //   );
    //   console.error(finalLLMResponse);
    // }
    // finalResponse = finalLLMResponse.direct_response || "";
    if (finalLLMResponse?.direct_response) {
      finalResponse = finalLLMResponse.direct_response as string;
    } else {
      console.error(
        "Could not generate final summary after tool use. No direct_response in:"
      );
    }
  }

  return finalResponse;
}
