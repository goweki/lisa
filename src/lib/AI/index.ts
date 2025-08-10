import { InstitutionTools } from "./providers/InstitutionTools";
import { UsersTools } from "./providers/UserTools";
import { CasesTools } from "./providers/CaseTools";
import { TasksTools } from "./providers/TaskTools";
import { ToolsManager } from "./agent/ToolsManager";
import { Agent } from "./agent/Agent";
import { GeminiLLMProvider } from "./llm/GeminiLLMProvider";
import { Content } from "@google/genai";
import { UserContext } from "./types/UserContext";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";

const dummyPrompt =
  "Find the latest trends in AI for 2025 specifically related to Large Language Models and summarize them search the web. Just return Json no additional text.";

export async function runAgent({
  user,
  prompt = dummyPrompt,
}: {
  user: UserContext;
  prompt: Array<HumanMessage | AIMessage> | string;
}): Promise<string | null> {
  // --- Agent Initialization (happens on each request for simplicity, can be optimized) ---
  const institutionProvider = new InstitutionTools(user);
  const usersProvider = new UsersTools(user);
  const caseProvider = new CasesTools(user);
  const taskProvider = new TasksTools(user);

  const institutionTools = ToolsManager.registerToolsFrom(institutionProvider);
  const userTools = ToolsManager.registerToolsFrom(usersProvider);
  const caseTools = ToolsManager.registerToolsFrom(caseProvider);
  const taskTools = ToolsManager.registerToolsFrom(taskProvider);
  // Initialize LLM Provider
  const llmProvider = new GeminiLLMProvider();
  const agent = new Agent(llmProvider);
  // Register all tools with the agent
  [
    ...institutionTools,
    ...userTools,
    ...caseTools,
    ...taskTools,
    // ...searchTools,
  ].forEach((tool) => agent.addTool(tool));

  const institutions = await agent.useTool("listInstitutions");
  const caseTypes = await agent.useTool("listCaseTypes");
  const cases = await agent.useTool("listCases");
  const def_toolResults: ToolMessage[] = [
    new ToolMessage({
      content: institutions,
      name: "listInstitutions",
      tool_call_id: "call_0",
    }),
    new ToolMessage({
      content: caseTypes,
      name: "listCaseTypes",
      tool_call_id: "call_1",
    }),
    new ToolMessage({
      content: cases,
      name: "listCases",
      tool_call_id: "call_2",
    }),
  ];
  // --- End Agent Initialization ---

  let finalResponse: string | null = null;

  // Step 1: Call LLM to determine if tools are needed
  const normalizedPrompt: Array<BaseMessage> =
    typeof prompt === "string" ? [new HumanMessage(prompt)] : prompt;

  const toolsPrompt = `
            Tool Outputs:
            ${JSON.stringify(def_toolResults, null, 2)}

            Tool Output Instructions:
            - Reference Tool Outputs above if any id field is required. This could be institutionId,caseTypeId...
        `;

  const initialLLMResponse = await agent.callLLM(
    normalizedPrompt,
    user,
    def_toolResults,
    toolsPrompt
  );

  console.log("Agent response from callLLM:", initialLLMResponse);

  if (!initialLLMResponse) {
    return null;
  }

  if (!initialLLMResponse.requires_tools) {
    console.log("Lisa AI DOES NOT require tools for this response");
    finalResponse = initialLLMResponse.direct_response || "";
  } else {
    console.log("Lisa AI requires tools");
    const toolResults: Record<string, string> = {};
    if (!initialLLMResponse.tool_calls) {
      console.error("Invalid LLMResponse: ", initialLLMResponse);
      return finalResponse;
    }
    for (const toolCall of initialLLMResponse.tool_calls) {
      // Execute each tool call and store its result
      // Consider better error handling for tool execution
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
            2. For each result, generate a short response (1-2 sentences).
            3. Use clear, informative language. Do not generate any additional text beyond the required summaries.
            
            Respond ONLY with a valid JSON object that matches the specified schema. Do not include any additional explanation, comment, markdown formatting, or any surrounding text. Do not wrap it in any punctuations, descriptors or triple backticks.
            The direct response should be in the 'direct_response' attribute in the JSON response.
            Do not require tool usage in this response.

            Format:
            Actions taken:
            1. *[Action taken]* - (description)
            2. *[Action taken]* - (description)

            (Concise summary of actions taken and steps moving forward)

            (Any lists the user may be required to select from or reference for next steps)
        `;

    // Step 3: Call LLM again for final summary
    const toolMessages = Object.entries(toolResults).map(
      ([toolName, output], index) =>
        new ToolMessage({
          content: output,
          name: toolName,
          tool_call_id: `call_${index}`, // unique ID for each call
        })
    );
    const finalPrompt_normalized: Array<BaseMessage> = [
      new SystemMessage(finalPrompt),
      ...toolMessages,
    ];

    const finalLLMResponse = await agent.callLLM(finalPrompt_normalized, user);

    if (finalLLMResponse?.direct_response) {
      finalResponse = finalLLMResponse.direct_response as string;
    } else {
      console.error(
        "Could not generate final summary after tool use. direct_response attribute DOES NOT exist"
      );
    }
  }

  return finalResponse;
}
