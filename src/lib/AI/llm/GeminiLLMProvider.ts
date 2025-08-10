// import {
//   GoogleGenAI,
//   SafetySetting,
//   HarmCategory,
//   HarmBlockThreshold,
//   type Content,
//   type Part,
// } from "@google/genai";
// import { LLMProvider } from "./LLMProvider";
// import { isValidJson } from "../utils/isValidJson";
// import { LLMInput } from "../agent/Agent";
// import { LLMResponse } from "../utils/createSystemPrompt";
// import { jsonrepair } from "jsonrepair";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const safetySettings: SafetySetting[] = [
//   {
//     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
// ];

// export class GeminiLLMProvider implements LLMProvider {
//   private gemini: GoogleGenAI;
//   private readonly modelName: string;

//   constructor(modelName?: string) {
//     if (!GEMINI_API_KEY) {
//       throw new Error("missing .env variable - GEMINI_API_KEY");
//     }

//     this.gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
//     this.modelName = modelName || "gemini-2.5-flash";
//   }

//   async callLLM(input: LLMInput): Promise<LLMResponse | string> {
//     console.log("llm_input.log: ", JSON.stringify(input));

//     const response = await this.gemini.models.generateContent({
//       model: this.modelName,
//       contents: input.prompt,
//       config: {
//         systemInstruction: input.system_prompt,
//         safetySettings,
//         thinkingConfig: {
//           thinkingBudget: 0, // Disables thinking
//         },
//       },
//     });
//     const fullResponse = response.text || "";

//     console.log("llm_response.log: ", fullResponse);

//     if (isValidJson(fullResponse)) {
//       return JSON.parse(fullResponse);
//     } else {
//       const brokenJson = fullResponse; // broken
//       const fixedJson = jsonrepair(brokenJson);
//       const parsedFixedJson = JSON.parse(fixedJson);

//       if (parsedFixedJson && typeof parsedFixedJson === "object") {
//         console.log("✅ Fixed response to valid JSON - ", parsedFixedJson);
//         return parsedFixedJson;
//       } else if (Array.isArray(parsedFixedJson)) {
//         console.warn(
//           "Tried fixing LLMResponse object, but got array!",
//           parsedFixedJson
//         );
//         if (parsedFixedJson.length === 1) {
//           return parsedFixedJson[0];
//         }
//       }

//       const err =
//         "❌ Invalid LLMResponse, expected it to be parsable to JSON, could not repair";
//       console.error(` ${err} \n> LLMResponse: `, fullResponse);
//       throw new Error(err);
//     }
//   }
// }

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

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

  async callLLM(input: LLMInput): Promise<LLMResponse | string> {
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

    console.log("llm_response.log: ", responseText);

    if (isValidJson(responseText)) {
      return JSON.parse(responseText);
    } else {
      const err = "❌ Invalid LLMResponse, expected it to be JSON object";
      console.error(` ${err} \n> LLMResponse: `, response.text);
      throw new Error(err);
    }
  }
}
