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
    const toolResults: Record<string, Record<string, any>> = {};
    if (!initialLLMResponse.tool_calls) {
      console.error("Invalid LLMResponse: ", initialLLMResponse);
      return finalResponse;
    }

    for (const toolCall of initialLLMResponse.tool_calls) {
      // Execute each tool call and store its result
      // Consider better error handling for tool execution
      try {
        toolResults[toolCall.tool] = {
          name: toolCall.tool,
          args: toolCall.args,
          output: await agent.useTool(toolCall.tool, toolCall.args),
        };
      } catch (toolError: any) {
        console.error(`Error executing tool ${toolCall.tool}:`, toolError);
        toolResults[toolCall.tool] = {
          name: toolCall.tool,
          args: toolCall.args,
          output: `Error: ${toolError.message || "Tool execution failed"}`,
        };
      }
    }

    // Step 3: Call LLM again for final summary
    const pairedMessages: BaseMessage[] = [];

    Object.values(toolResults).forEach(({ name, args, output }) => {
      // 1. The assistant's function call
      pairedMessages.push(
        new AIMessage({
          content: JSON.stringify({
            thoughts: initialLLMResponse.thought,
            plan: initialLLMResponse.plan,
          }),
          additional_kwargs: {
            tool_calls: [
              {
                id: `call_${name}`,
                type: "function",
                function: {
                  name: name,
                  arguments: args ? JSON.stringify(args) : "",
                },
              },
            ],
          },
        })
      );

      pairedMessages.push(
        new ToolMessage({
          content: output,
          name,
          tool_call_id: `call_${name}`,
        })
      );
    });

    const finalPrompt_normalized: Array<BaseMessage> = pairedMessages;

    const finalLLMResponse = await agent.callLLM(finalPrompt_normalized, user);

    if (finalLLMResponse?.direct_response) {
      finalResponse = finalLLMResponse.direct_response as string;
    } else {
      console.error(
        "Could not generate final summary after tool use. direct_response attribute DOES NOT exist - ",
        finalResponse
      );
    }
  }

  return finalResponse;
}
