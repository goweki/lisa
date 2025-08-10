export interface LLMProvider {
  /**
   * Given an input object (including prompt, system prompt, and other parameters),
   * returns the LLM’s response as a Promise.
   */
  callLLM(input: any): Promise<any | void>;
}
