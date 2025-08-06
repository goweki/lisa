/** Type for tool functions (they may be asynchronous). */
export type ToolFunction = (...args: any[]) => Promise<string> | string;
