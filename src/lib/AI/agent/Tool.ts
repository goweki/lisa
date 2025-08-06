import {ToolParameter} from "../interfaces/ToolParameter";
import {ToolFunction} from "../types/ToolFunction";

/**
 * The Tool class encapsulates a tool’s executable function along with its metadata.
 */
export class Tool {
    name: string;
    description: string;
    func: ToolFunction;
    parameters: Record<string, ToolParameter>;

    constructor(
        name: string,
        description: string,
        func: ToolFunction,
        parameters: Record<string, ToolParameter>
    ) {
        this.name = name;
        this.description = description;
        this.func = func;
        this.parameters = parameters;
    }

    /** Executes the tool function with the provided arguments. */
    async call(...args: any[]): Promise<string> {
        return this.func(...args);
    }
}