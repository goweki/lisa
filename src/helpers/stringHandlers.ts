/**
 * Truncates a string to a specified length and appends ellipsis if needed.
 *
 * @param {string} str - The original string.
 * @param {number} len - Maximum length before truncation.
 * @returns {string} - Truncated string with ellipsis if it exceeded the length.
 *
 * @example
 * strTruncate("Hello world", 5); // "Hello ..."
 */
export function strTruncate(str: string, len: number): string {
  return str.length > len ? `${str.slice(0, len)} ...` : str;
}

/**
 * Converts a string to Pascal case (capitalizes the first letter).
 *
 * @param {string} str - The input string.
 * @returns {string} - The string with the first letter capitalized, rest in lowercase.
 *
 * @example
 * strPascalCase("hello"); // "Hello"
 */
export function strPascalCase(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";
}

/**
 * Compares two strings for an exact match (case-sensitive).
 *
 * @param {string} str1 - The first string.
 * @param {string} str2 - The second string.
 * @returns {boolean} - `true` if strings match exactly, otherwise `false`.
 *
 * @example
 * strsMatch("abc", "abc"); // true
 * strsMatch("abc", "Abc"); // false
 */
export function strsMatch(str1: string, str2: string): boolean {
  return str1 === str2;
}
