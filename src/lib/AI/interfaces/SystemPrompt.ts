import {ToolParameter} from "./ToolParameter";

/** Represents the structure of a system prompt passed to the LLM. */
export interface SystemPrompt {
    role: string;
    instructions: string[];
    tools: Array<{
        name: string;
        description: string;
        parameters: Record<string, ToolParameter>;
    }>;
    response_format: {
        type: string;
        schema: {
            requires_tools: { type: string; description: string };
            direct_response: { type: string; description: string; optional: boolean };
            thought: { type: string; description: string; optional: boolean };
            plan: { type: string; items: { type: string }; description: string; optional: boolean };
            tool_calls: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        tool: { type: string; description: string };
                        args: { type: string; description: string };
                    };
                };
                description: string;
                optional: boolean;
            };
        };
        examples: any[];
    };
}