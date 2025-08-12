import { InstitutionTools } from "./providers/InstitutionTools";
import { UsersTools } from "./providers/UserTools";
import { UserTaskTools } from "./providers/UserTaskTools";
import { CasesTools } from "./providers/CaseTools";
import { TasksTools } from "./providers/TaskTools";
import { ToolsManager } from "./agent/ToolsManager";
import { Agent, AgentName } from "./agent/Agent";
import { GeminiLLMProvider } from "./llm/GeminiLLMProvider";
import { Content } from "@google/genai";
import { UserContext } from "./types/UserContext";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { Tool } from "./agent/Tool";

const dummyPrompt: Record<AgentName, string> = {
  lisa: "What is Lisa?",
  kokose: "How do i sign up to Kokose?",
};

export async function runAgent({
  user,
  prompt: _prompt,
  agentName,
}: {
  user?: UserContext;
  prompt: Array<HumanMessage | AIMessage> | string;
  agentName: AgentName;
}): Promise<string | null> {
  const prompt = _prompt || dummyPrompt[agentName];
  // Initialize LLM Provider
  const llmProvider = new GeminiLLMProvider();
  const agent = new Agent(llmProvider);
  // --- Agent Initialization (happens on each request for simplicity, can be optimized) ---

  if (user) {
    const institutionProvider = new InstitutionTools(user);
    const usersProvider = new UsersTools(user);
    const caseProvider = new CasesTools(user);
    const taskProvider = new TasksTools(user);

    const institutionTools =
      ToolsManager.registerToolsFrom(institutionProvider);
    const userTools = ToolsManager.registerToolsFrom(usersProvider);
    const caseTools = ToolsManager.registerToolsFrom(caseProvider);
    const taskTools = ToolsManager.registerToolsFrom(taskProvider);

    // Register all tools with the agent
    [
      ...institutionTools,
      ...userTools,
      ...caseTools,
      ...taskTools,
      // ...searchTools,
    ].forEach((tool) => agent.addTool(tool));
  } else {
    const userTaskProvider = new UserTaskTools();
    const userTaskTools = ToolsManager.registerToolsFrom(userTaskProvider);
    [...userTaskTools].forEach((tool) => agent.addTool(tool));
  }

  function buildToolMessages(names: string[], results: any[]): ToolMessage[] {
    return names.map(
      (name, i) =>
        new ToolMessage({
          content: results[i],
          name,
          tool_call_id: `call_${i}`,
        })
    );
  }

  let def_toolResults: ToolMessage[] = [];

  switch (agentName) {
    case "lisa": {
      const [institutions, caseTypes, cases, tasks] = await Promise.all([
        agent.useTool("listInstitutions"),
        agent.useTool("listCaseTypes"),
        agent.useTool("listCases"),
        agent.useTool("listTasks"),
      ]);
      def_toolResults = buildToolMessages(
        ["listInstitutions", "listCaseTypes", "listCases", "listTasks"],
        [institutions, caseTypes, cases, tasks]
      );
      break;
    }
    case "kokose": {
      if (user) {
        const tasks = await agent.useTool("listTasks");
        def_toolResults = buildToolMessages(["listTasks"], [tasks]);
      }
      break;
    }
    default: {
      def_toolResults = [];
    }
  }
  // --- End Agent Initialization ---

  let finalResponse: string | null = null;

  // Step 1: Call LLM to determine if tools are needed
  const normalizedPrompt: Array<BaseMessage> =
    typeof prompt === "string" ? [new HumanMessage(prompt)] : prompt;

  const toolsPrompt_1 = `
            Tool Outputs:
            ${JSON.stringify(def_toolResults, null, 2)}

            Tool Output Instructions:
            - Reference Tool Outputs above (if any) if any id field is required. This could be institutionId,caseTypeId...
        `;

  const firstLLMResponse = await agent.callLLM({
    prompt: normalizedPrompt,
    user,
    tools_prompt: toolsPrompt_1,
    agent: agentName,
  });

  console.log("Agent response from callLLM:", firstLLMResponse);

  if (!firstLLMResponse) {
    return null;
  }

  if (!firstLLMResponse.requires_tools) {
    console.log("AI DOES NOT require tools for this response");
    finalResponse = firstLLMResponse.direct_response || "";
  } else {
    console.log("AI requires tools: 1st loop");
    const toolResults: Record<string, Record<string, any>> = {};
    if (!firstLLMResponse.tool_calls) {
      console.error("Invalid LLMResponse: ", firstLLMResponse);
      return finalResponse;
    }

    for (const toolCall of firstLLMResponse.tool_calls) {
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

    const pairedMessages: BaseMessage[] = [];

    Object.values(toolResults).forEach(({ name, args, output }) => {
      // 1. The assistant's function call
      pairedMessages.push(
        new AIMessage({
          content: JSON.stringify({
            thoughts: firstLLMResponse.thought,
            plan: firstLLMResponse.plan,
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

    const secondPrompt_normalized: Array<BaseMessage> = pairedMessages;
    const tools_prompt_final = `Do not use a tool in this specific repsonse. Summerize the tool output and advise steps forward.`;

    const secondLLMResponse = await agent.callLLM({
      prompt: secondPrompt_normalized,
      user,
      tools_prompt: tools_prompt_final,
      agent: agentName,
    });

    if (secondLLMResponse?.direct_response) {
      finalResponse = secondLLMResponse.direct_response as string;
    } else {
      console.error(
        "No secondLLMResponse.direct_response: ",
        secondLLMResponse
      );
    }
  }

  return finalResponse;
}
