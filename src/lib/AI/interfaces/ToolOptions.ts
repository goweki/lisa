/** Options passed to the tool decorator. */
export interface ToolOptions {
    /** A docstring describing what the tool does and its parameters. */
    docstring: string;
    /** Parameter metadata that can be used to override what’s in the docstring. */
    parameters?: Record<string, { type: string; description: string }>;
}