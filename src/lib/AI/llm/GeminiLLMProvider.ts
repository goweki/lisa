import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import { LLMInput } from "../agent/Agent";
import { LLM_RESPONSE_SCHEMA, LLMResponse } from "../utils/createSystemPrompt";
import { LLMProvider } from "./LLMProvider";
import { isValidJson } from "../utils/isValidJson";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export class GeminiLLMProvider implements LLMProvider {
  private gemini: ChatGoogleGenerativeAI;

  constructor(modelName?: string) {
    if (!GEMINI_API_KEY) {
      throw new Error("missing .env variable - GEMINI_API_KEY");
    }

    this.gemini = new ChatGoogleGenerativeAI({
      model: modelName || "gemini-2.5-flash",
      apiKey: GEMINI_API_KEY,
      safetySettings,
    });
  }

  async callLLM(input: LLMInput): Promise<LLMResponse | void> {
    const {
      systemPrompt,
      prompt,
      toolResults = [],
      prompt_template,
      ...llmParams
    } = input;

    const messages = [input.systemPrompt, ...toolResults, ...input.prompt];
    console.log("llm_input.log: ", messages);

    // const structuredLlm = this.gemini.withStructuredOutput(LLM_RESPONSE_SCHEMA);
    const response = await this.gemini.invoke(messages);

    const responseText = response.text;

    console.log(`llm_response.log: (${typeof responseText}) `, responseText);

    const cleanResponseText = responseText
      .replace(/```[a-zA-Z]*\n?/g, "")
      // Remove closing triple backticks
      .replace(/```/g, "")
      // Trim leading/trailing whitespace
      .trim();
    try {
      if (isValidJson(cleanResponseText)) {
        return JSON.parse(cleanResponseText);
      } else {
        console.warn("LLM Response is not valid JSON", responseText);
        return;
      }
    } catch (error: any) {
      const err = `❌ Invalid LLMResponse, also could not be repaired - ${error.message || JSON.stringify(error)}`;
      console.error(` ${err} \n> LLMResponse: `, response.text);
      return;
    }
  }
}
