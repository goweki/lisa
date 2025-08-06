import {Tool} from "./Tool";
import {ToolMetadata} from "../interfaces/ToolMetadata";

/**
 * The ToolsManager scans a provider instance for methods decorated as tools
 * and registers them as Tool instances.
 */
export class ToolsManager {
    /**
     * Given an instance of a provider class, returns an array of Tools based on
     * methods decorated with tool metadata.
     */
    static registerToolsFrom(providerInstance: any): Tool[] {
        const tools: Tool[] = [];
        const prototype = Object.getPrototypeOf(providerInstance);
        const methodNames = Object.getOwnPropertyNames(prototype)
            .filter(name => typeof prototype[name] === 'function' && name !== 'constructor');

        for (const name of methodNames) {
            const method = prototype[name];
            // If the method has attached toolMetadata, create a Tool instance.
            if (method.toolMetadata) {
                // Bind the method to the instance so "this" is correct.
                const boundFunc = method.bind(providerInstance);
                const metadata: ToolMetadata = method.toolMetadata;
                tools.push(new Tool(metadata.name, metadata.description, boundFunc, metadata.parameters));
            }
        }
        return tools;
    }
}