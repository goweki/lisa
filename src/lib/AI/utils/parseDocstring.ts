/**
 * Parses a docstring to extract parameter descriptions.
 * Expected format:
 *
 *   Description...
 *
 *   Parameters:
 *   - param1: Description...
 *   - param2: Description...
 *
 * @param docstring The documentation string.
 * @returns A mapping of parameter names to descriptions.
 */
export function parseDocstringParams(docstring: string): Record<string, string> {
    if (!docstring) return {};
    const params: Record<string, string> = {};
    const lines = docstring.split('\n');
    let inParams = false;
    let currentParam: string | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Parameters:')) {
            inParams = true;
            continue;
        }
        if (inParams) {
            if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                const parts = trimmed.replace(/^[-*]\s*/, '').split(':');
                if (parts.length >= 2) {
                    currentParam = parts[0].trim();
                    params[currentParam] = parts.slice(1).join(':').trim();
                }
            } else if (currentParam && trimmed) {
                params[currentParam] += ' ' + trimmed;
            } else if (!trimmed) {
                inParams = false;
            }
        }
    }
    return params;
}