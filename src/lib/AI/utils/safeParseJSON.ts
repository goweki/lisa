export function safeParseJSON(text: string): any | void {
  try {
    // Remove markdown triple backticks if present
    const cleaned = text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse LLM JSON:", e, "Raw text:", text);
    return;
  }
}
