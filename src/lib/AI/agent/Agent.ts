import { LLMProvider } from "../llm/LLMProvider";
import { createSystemPrompt, LLMResponse } from "../utils/createSystemPrompt";
import { Tool } from "./Tool";
import { UserContext } from "../types/UserContext";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
export type AgentName = "lisa" | "kokose";

export type LLMInput = {
  prompt: Array<AIMessage | HumanMessage>;
  systemPrompt: SystemMessage;
  toolResults?: Array<ToolMessage>;
  prompt_template?: string;
  max_tokens?: number;
  max_new_tokens?: number;
};

export class Agent {
  private tools: Record<string, Tool> = {};
  private readonly llmProvider: LLMProvider;

  constructor(llmProvider: LLMProvider) {
    this.llmProvider = llmProvider;
  }

  addTool(tool: Tool): void {
    this.tools[tool.name] = tool;
  }

  getAvailableTools(): string[] {
    return Object.values(this.tools).map(
      (tool) => `${tool.name}: ${tool.description}`
    );
  }

  // async useTool(
  //   toolName: string,
  //   args?: Record<string, unknown>
  // ): Promise<string> {
  //   const tool = this.tools[toolName];
  //   if (!tool) {
  //     throw new Error(
  //       `Tool '${toolName}' not found. Available: ${Object.keys(this.tools).join(", ")}`
  //     );
  //   }

  //   const orderedKeys = Object.keys(tool.parameters);
  //   const argValues = orderedKeys.map((key) =>
  //     args?.hasOwnProperty(key) ? args[key] : undefined
  //   );

  //   return tool.call(...argValues);
  // }
  async useTool(
    toolName: string,
    args?: Record<string, unknown>
  ): Promise<string> {
    const tool = this.tools[toolName];
    if (!tool) {
      const errorMsg = `⚠️ Tool '${toolName}' not found. Available: ${Object.keys(this.tools).join(", ") || "none"}`;
      console.error(errorMsg);
      return errorMsg;
    }

    try {
      const orderedKeys = Object.keys(tool.parameters || {});
      const argValues = orderedKeys.map((key) =>
        Object.prototype.hasOwnProperty.call(args || {}, key)
          ? args?.[key]
          : undefined
      );

      return await tool.call(...argValues);
    } catch (err: any) {
      const errorMsg = `⚠️ Error executing tool '${toolName}': ${err?.message || err}`;
      console.error(errorMsg, err);
      return errorMsg;
    }
  }

  async callLLM({
    prompt,
    user,
    tools_prompt,
    toolResults,
    agent,
  }: {
    prompt: Array<AIMessage | HumanMessage>;
    user?: UserContext;
    tools_prompt?: string;
    toolResults?: Array<ToolMessage>;
    agent?: AgentName;
  }): Promise<LLMResponse | void> {
    const toolsArray = Object.values(this.tools);
    const systemPrompt = new SystemMessage(
      JSON.stringify(
        createSystemPrompt(toolsArray, agent || "lisa", user),
        null,
        2
      ) + `\n\n ${tools_prompt}`
    );

    const promptTemplate =
      `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}` +
      "<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}" +
      "<|eot_id|><|start_header_id|>lisa<|end_header_id|>\n\n";

    const input: LLMInput = {
      prompt,
      systemPrompt,
      toolResults,
      max_new_tokens: 1024,
      max_tokens: 2048,
      prompt_template: promptTemplate,
    };

    try {
      return await this.llmProvider.callLLM(input);
    } catch (err) {
      console.error("LLM call failed", {
        error: err,
        userId: user?.id,
        promptCount: prompt.length,
      });
      return;
    }
  }
}
