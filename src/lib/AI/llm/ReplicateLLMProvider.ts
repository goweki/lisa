import Replicate from "replicate";
import { LLMProvider } from "./LLMProvider";
import { isValidJson } from "../utils/isValidJson";

export class ReplicateLLMProvider implements LLMProvider {
  private replicate: Replicate;
  private readonly modelName:
    | `${string}/${string}`
    | `${string}/${string}:${string}`;

  constructor(
    modelName: `${string}/${string}` | `${string}/${string}:${string}`
  ) {
    this.replicate = new Replicate();
    this.modelName = modelName;
  }

  async callLLM(input: any): Promise<any> {
    console.log("llm_input.log - ", JSON.stringify(input));

    let fullResponse = "";
    for await (const event of this.replicate.stream(this.modelName, {
      input,
    })) {
      fullResponse += event;
    }

    console.log("llm_response.log - ", fullResponse);

    if (isValidJson(fullResponse)) {
      return JSON.parse(fullResponse);
    } else {
      return fullResponse;
    }
  }
}
