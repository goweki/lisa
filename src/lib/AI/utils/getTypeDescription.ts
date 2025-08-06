/**
 * Returns a human-readable description for a type hint.
 *
 * @param typeHint The provided type hint.
 * @returns A string description.
 */
export function getTypeDescription(typeHint: any): string {
    return typeof typeHint === 'string' ? typeHint : 'unknown';
}