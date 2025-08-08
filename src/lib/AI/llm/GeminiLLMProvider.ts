import {
  GoogleGenAI,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  type Content,
  type Part,
} from "@google/genai";
import { LLMProvider } from "./LLMProvider";
import { isValidJson } from "../utils/isValidJson";
import { LLMInput } from "../agent/Agent";
import { LLMResponse } from "../utils/createSystemPrompt";

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
  private gemini: GoogleGenAI;
  private readonly modelName: string;

  constructor(modelName?: string) {
    if (!GEMINI_API_KEY) {
      throw new Error("missing .env variable - GEMINI_API_KEY");
    }

    this.gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this.modelName = modelName || "gemini-2.5-flash";
  }

  async callLLM(input: LLMInput): Promise<LLMResponse | string> {
    console.log("llm_input.log: ", JSON.stringify(input));

    const response = await this.gemini.models.generateContent({
      model: this.modelName,
      contents: input.prompt,
      config: {
        systemInstruction: input.system_prompt,
        safetySettings,
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    const fullResponse = response.text || "";

    console.log("llm_response.log: ", fullResponse);

    if (isValidJson(fullResponse)) {
      return JSON.parse(fullResponse);
    } else {
      const err = "Invalid LLMResponse, expected it to be parsable to JSON";
      console.error(` ${err} \n> LLMResponse: `, fullResponse);
      throw new Error(err);
    }
  }
}
