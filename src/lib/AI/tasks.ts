import {TaskTools} from "./providers/TaskTools";
import {ToolsManager} from "./agent/ToolsManager";
import {Agent} from "./agent/Agent";
import {ReplicateLLMProvider} from "./llm/ReplicateLLMProvider";

(async () => {
    const taskProvider = new TaskTools();
    const taskTools = ToolsManager.registerToolsFrom(taskProvider);

    const llmProvider = new ReplicateLLMProvider("meta/meta-llama-3-8b-instruct");
    const agent = new Agent(llmProvider);
    taskTools.forEach(tool => agent.addTool(tool));

    const userPrompt = "Manage my tasks: add a new task 'Buy shoes' due on 2025-03-01, update task with ID 10 to mark it as completed, and list all tasks. In your response only return JSON no text or anything else.";
    const initialLLMResponse = await agent.callLLM(userPrompt);

    if (!initialLLMResponse.requires_tools) {
        console.log(initialLLMResponse.direct_response);
    } else {
        const toolResults: Record<string, string> = {};
        for (const toolCall of initialLLMResponse.tool_calls) {
            toolResults[toolCall.tool] = await agent.useTool(toolCall.tool, toolCall.args)
        }

        const finalPrompt = `
            User Query: ${userPrompt}

            Tool Outputs:
            ${JSON.stringify(toolResults, null, 2)}
            
            Instructions:
            Based on the above outputs, provide a final, concise summary of the actions performed. create a summary of current tasks in one sentence like the number of current tasks. No tool usage required.
        `;
        const finalLLMResponse = await agent.callLLM(finalPrompt);
        console.log("Final answer:");
        console.log(finalLLMResponse.direct_response);
    }
})();
