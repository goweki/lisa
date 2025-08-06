import {ToolParameter} from "./ToolParameter";

/** Metadata attached to a decorated method. */
export interface ToolMetadata {
    name: string;
    description: string;
    parameters: Record<string, ToolParameter>;
}