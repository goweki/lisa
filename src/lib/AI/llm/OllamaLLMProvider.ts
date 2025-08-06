import { LLMProvider } from "./LLMProvider";
import { writeToLog } from "../utils/writeToLog";
import ollama, {Tool} from "ollama";

export class OllamaLLMProvider implements LLMProvider {
    private readonly modelName: string;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    async callLLM(input: any): Promise<any> {
        await writeToLog('llm_input.log', JSON.stringify(input));
        const tools: Tool[] = []

        const request = {
            model: this.modelName,
            messages: [
                {role: 'user', content: input.prompt},
                {role: 'system', content: input.system_prompt},
            ],
            format: 'json',
            tools: [],
            // template: input.prompt_template,
            options: input.options || {}
        };

        let fullResponse = await ollama.chat(request);

        await writeToLog('llm_response.log', JSON.stringify(fullResponse.message));

        return fullResponse.message;
    }
}
