import { Tool } from "../agent/Tool";
import { SystemPrompt } from "../interfaces/SystemPrompt";

/**
 * Generates the system prompt based on available tools, formatted for Gemini-compatible reasoning and structured tool use.
 *
 * @param tools Array of registered tools.
 * @returns The system prompt object.
 */
export function createSystemPrompt(tools: Tool[]): SystemPrompt {
  return {
    role: "lisa",
    instructions: [
      "You are an intelligent assistant named Lisa.",
      "Only use tools when necessary.",
      "If the answer can be provided directly, or you need more information first, do not use a tool.",
      "Plan the steps if a tool must be used.",
      "Respond only with a JSON object matching the schema. Do not include any extra explanation.",
    ],
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    })),
    response_format: {
      type: "json",
      schema: {
        requires_tools: {
          type: "boolean",
          description: "Whether tools are needed in the immediate next step",
        },
        direct_response: {
          type: "string",
          description:
            "Response when no tools are needed in the consequent step",
          optional: true,
        },
        thought: {
          type: "string",
          description:
            "Reasoning on how to solve the query (only when tools are needed in the next step)",
          optional: true,
        },
        plan: {
          type: "array",
          items: { type: "string" },
          description:
            "Steps to solve the query (only when tools are needed in the next step)",
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
          query: "Get today's tasks for user 123",
          response: {
            requires_tools: true,
            thought: "I need to fetch tasks for user 123.",
            plan: ["Call get_today_tasks with user_id 123", "Return the tasks"],
            tool_calls: [
              {
                tool: "get_due_tasks",
                args: {
                  user_id: "email",
                },
              },
            ],
          },
        },
        {
          query: "Get today's tasks",
          response: {
            requires_tools: false,
            thought:
              "I need to fetch tasks for the user but has not provided their email or tel.",
            plan: [
              "Request for users email or tel",
              "Call get_due_tasks with user's email/tel, then filter out those due today and in the near future",
              "Return the tasks and a summary",
            ],
            tool_calls: [
              {
                tool: "get_due_tasks",
                args: {
                  user_id: "123",
                },
              },
            ],
          },
        },
        {
          query: "Tell me a fun fact.",
          response: {
            requires_tools: false,
            direct_response: "Did you know that octopuses have three hearts?",
          },
        },
      ],
    },
  };
}
