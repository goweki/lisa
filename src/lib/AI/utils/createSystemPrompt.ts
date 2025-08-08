import { Tool } from "../agent/Tool";
import { SystemPrompt } from "../interfaces/SystemPrompt";
import { UserContext } from "../types/UserContext";
import { getUserPermissions } from "./getUserPermissions";

const BASE_INSTRUCTIONS: string[] = [
  "You are an intelligent assistant named Lisa.",
  "Respond ONLY with a JSON object that matches the specified schema. Do not include any additional explanation.",
  "Use tools only when necessary and after user has provided all the attributes required to use the tool immediately.",
  "If a direct answer is possible or more information is needed first, do NOT require a tool. Only set requires_tools=true if a tool is actually needed and all tool parameters are provided and are valid",
  "Always plan the required steps before using any tool.",
  "Respect permissions strictly based on the provided permissions structure.",
  "If a user lacks permission for the requested operation, respond with an appropriate error message in the JSON (do not use tools).",
  "When an ID is required for create, delete, or modify actions, use a tool first to list relevant entities with indexes (e.g., 1, 2, 3...) so the user can select one by index.",
];

const RESPONSE_SCHEMA = {
  type: "json",
  schema: {
    requires_tools: {
      type: "boolean",
      description: "Whether tools are needed in the immediate next step",
    },
    direct_response: {
      type: "string",
      description: "Response when no tools are needed in the consequent step",
      optional: true,
    },
    thought: {
      type: "string",
      description:
        "Reasoning on how to solve the query (only when tools are needed)",
      optional: true,
    },
    plan: {
      type: "array",
      items: { type: "string" },
      description: "Steps to solve the query (only when tools are needed)",
      optional: true,
    },
    tool_calls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tool: { type: "string", description: "Name of the tool" },
          args: { type: "object", description: "Parameters for the tool" },
        },
      },
      description: "Tools to call in sequence (if required)",
      optional: true,
    },
  },
  examples: [
    {
      query: "Tell me a joke",
      response: {
        requires_tools: false,
        direct_response:
          "Why don’t skeletons fight each other? They don’t have the guts.",
      },
    },
    {
      query: "Create a case",
      response: {
        requires_tools: false,
        direct_response: "You do not have permission to create a new case.",
      },
    },
    {
      query: "Get upcoming tasks for me",
      response: {
        requires_tools: true,
        thought: "I need to fetch tasks associated with the user.",
        plan: [
          "Call get_due_tasks",
          "Filter for upcoming tasks",
          "Return result",
        ],
        tool_calls: [
          {
            tool: "get_due_tasks",
            args: { user_id: "123" },
          },
        ],
      },
    },
  ],
};

type LLMResponseKey = keyof typeof RESPONSE_SCHEMA.schema;
export type LLMResponse = Record<LLMResponseKey, any>;

/**
 * Builds a system prompt for the LLM with clearly defined user permissions and tool access.
 */
export function createSystemPrompt(
  tools: Tool[],
  user: UserContext
): SystemPrompt {
  const permissions = getUserPermissions(user);
  console.log("Permissions - ", permissions);

  return {
    role: "lisa",
    instructions: [
      ...BASE_INSTRUCTIONS.slice(0, 1),
      `You must respect the user's permissions when executing actions. The user has the following permissions:\n- ${permissions.join("\n- ")}`,
      ...BASE_INSTRUCTIONS.slice(1),
    ],
    tools: tools.map(({ name, description, parameters }) => ({
      name,
      description,
      parameters,
    })),
    response_format: RESPONSE_SCHEMA,
  };
}
