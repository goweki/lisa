// import { User, UserRole } from "@prisma/client";
// import { Tool } from "../agent/Tool";
// import { SystemPrompt } from "../interfaces/SystemPrompt";
// import { CustomUser } from "..";

// /**
//  * Generates the system prompt based on available tools, formatted for Gemini-compatible reasoning and structured tool use.
//  *
//  * @param tools Array of registered tools.
//  * @returns The system prompt object.
//  */
// export function createSystemPrompt(
//   tools: Tool[],
//   user: CustomUser
// ): SystemPrompt {
//   return {
//     role: "lisa",
//     instructions: [
//       "You are an intelligent assistant named Lisa.",
//       `Use the following user attributes to determine their role and permissions (e.g., systemAdmin, institution admin, etc.): ${user}`,
//       "Respond ONLY with a JSON object that matches the specified schema. Do not include any additional explanation.",
//       "Use tools only when necessary.",
//       "If a direct answer is possible or more information is needed first, do NOT trigger a tool. Only set requires_tools=true if a tool is actually needed.",
//       "Always plan the required steps before using any tool.",
//       "Enforce permissions strictly before using or recommending any tool:",
//       "- Only users with systemAdmin === true can modify *any* user or institution data.",
//       "- Non-systemAdmin users may only modify their *own* user data, or data belonging to institutions where they are explicitly marked as admins.",
//       "If a user lacks permission for the requested operation, respond with an appropriate error message in the JSON (do not use tools).",
//       "When an ID is required for create, delete, or modify actions, use a tool first to list relevant entities with indexes (e.g., 1, 2, 3...) so the user can select one by index.",
//     ],
//     tools: tools.map((tool) => ({
//       name: tool.name,
//       description: tool.description,
//       parameters: tool.parameters,
//     })),
//     response_format: {
//       type: "json",
//       schema: {
//         requires_tools: {
//           type: "boolean",
//           description: "Whether tools are needed in the immediate next step",
//         },
//         direct_response: {
//           type: "string",
//           description:
//             "Response when no tools are needed in the consequent step",
//           optional: true,
//         },
//         thought: {
//           type: "string",
//           description:
//             "Reasoning on how to solve the query (only when tools are needed in the next step)",
//           optional: true,
//         },
//         plan: {
//           type: "array",
//           items: { type: "string" },
//           description:
//             "Steps to solve the query (only when tools are needed in the next step)",
//           optional: true,
//         },
//         tool_calls: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               tool: { type: "string", description: "Name of the tool" },
//               args: { type: "object", description: "Parameters for the tool" },
//             },
//           },
//           description: "Tools to call in sequence (if required)",
//           optional: true,
//         },
//       },
//       examples: [
//         {
//           query: "Get today's tasks for user 123",
//           response: {
//             requires_tools: true,
//             thought: "I need to fetch tasks for user 123.",
//             plan: ["Call get_today_tasks with user_id 123", "Return the tasks"],
//             tool_calls: [
//               {
//                 tool: "get_due_tasks",
//                 args: {
//                   user_id: "email",
//                 },
//               },
//             ],
//           },
//         },
//         {
//           query: "Get today's tasks",
//           response: {
//             requires_tools: false,
//             thought:
//               "I need to fetch tasks for the user but has not provided their email or tel.",
//             plan: [
//               "Request for users email or tel",
//               "Call get_due_tasks with user's email/tel, then filter out those due today and in the near future",
//               "Return the tasks and a summary",
//             ],
//             tool_calls: [
//               {
//                 tool: "get_due_tasks",
//                 args: {
//                   user_id: "123",
//                 },
//               },
//             ],
//           },
//         },
//         {
//           query: "Tell me a fun fact.",
//           response: {
//             requires_tools: false,
//             direct_response: "Did you know that octopuses have three hearts?",
//           },
//         },
//       ],
//     },
//   };
// }

import { Tool } from "../agent/Tool";
import { SystemPrompt } from "../interfaces/SystemPrompt";
import { UserContext } from "../types/UserContext";
import { getUserPermissions } from "./getUserPermissions";

const BASE_INSTRUCTIONS: string[] = [
  "You are an intelligent assistant named Lisa.",
  "Respond ONLY with a JSON object that matches the specified schema. Do not include any additional explanation.",
  "Use tools only when necessary.",
  "If a direct answer is possible or more information is needed first, do NOT trigger a tool. Only set requires_tools=true if a tool is actually needed.",
  "Always plan the required steps before using any tool.",
  "Respect permissions strictly based on the provided permissions structure. Only ",
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
