import { ToolOptions } from "../interfaces/ToolOptions";
import { ToolParameter } from "../interfaces/ToolParameter";
import { ToolMetadata } from "../interfaces/ToolMetadata";
import { parseDocstringParams } from "../utils/parseDocstring";
import { getTypeDescription } from "../utils/getTypeDescription";

/**
 * A method decorator that marks a class method as a tool.
 * It attaches metadata (including a docstring and parameter definitions) to the method.
 */
export function ToolDecorator(options: ToolOptions): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // Extract the docstring provided in the options.
    const docstring = options.docstring;
    // Parse parameter descriptions from the docstring.
    const paramDocs = parseDocstringParams(docstring);
    const parameters: Record<string, ToolParameter> = {};

    if (options.parameters) {
      for (const param in options.parameters) {
        parameters[param] = {
          type: getTypeDescription(options.parameters[param].type),
          description:
            paramDocs[param] ||
            options.parameters[param].description ||
            "No description available",
        };
      }
    }
    // Attach metadata to the method.
    descriptor.value.toolMetadata = {
      name: propertyKey.toString(),
      description: docstring.split("\n\n")[0] || "No description available",
      parameters: parameters,
    } as ToolMetadata;
    return descriptor;
  };
}
