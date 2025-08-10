import prisma from "@/lib/prisma/prisma";

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

/**
 * Formats a number into a human-readable string with 'k' for thousands.
 * Examples:
 * 1000 => "1k"
 * 300000 => "300k"
 * 6000 => "6k"
 * 1234 => "1.2k"
 * 100 => "100" (numbers below 1000 are returned as is)
 * 1000000 => "1000k" (or "1M" if you extend to millions)
 *
 * @param num The number to format.
 * @param decimalPlaces (Optional) Number of decimal places for k-formatted numbers. Defaults to 1.
 * @returns The formatted string.
 */
export function formatNumberToK(
  num: number,
  decimalPlaces: number = 1
): string {
  // Handle non-finite numbers (NaN, Infinity)
  if (!Number.isFinite(num)) {
    return String(num);
  }

  // Define the threshold for 'k'
  const KILO = 1000;

  // If the number is less than 1000, return it as is (no 'k' suffix)
  if (num < KILO) {
    return String(num);
  }

  // Calculate the value in thousands
  const numInK = num / KILO;

  // Format to the specified number of decimal places
  // toFixed returns a string, so we need to convert it to a number first
  // to remove trailing zeros if they are not significant, then back to string.
  // Using parseFloat to strip trailing zeros and ensure correct rounding behavior
  const formattedNum = parseFloat(numInK.toFixed(decimalPlaces));

  return `${formattedNum}k`;
}

/**
 * Extracts the first word (substring before the first whitespace) from a given string.
 *
 * @param input - The input string to process.
 * @returns The first section of the string before any whitespace. If there is no whitespace, returns the full string.
 *
 * @example
 * getFirstWord("Hello world"); // returns "Hello"
 * getFirstWord("OneWord");     // returns "OneWord"
 * getFirstWord("   Leading space"); // returns ""
 */
export function strFirstWord(input: string): string {
  const trimmed = input.trim();
  const firstSpaceIndex = trimmed.indexOf(" ");

  return firstSpaceIndex === -1 ? trimmed : trimmed.slice(0, firstSpaceIndex);
}

/**
 * Generates a unique institution code based on a given name.
 * The code consists of six evenly spaced letters from the name (ignoring spaces)
 * followed by the last two digits of the current year.
 * Ensures that no existing institution has a code with at least three matching characters
 * in the same positions as the generated code.
 *
 * @param prisma - Prisma client instance for database access.
 * @param name - The institution name to generate the code from.
 * @returns A unique code in the format "XXXXXXYY".
 *
 * @throws Error if a unique code cannot be generated after multiple attempts.
 */
export async function generateUniqueInstitutionCode(
  name: string
): Promise<string> {
  const MAX_ATTEMPTS = 5;
  const MIN_SIMILAR_CHARS = 3;

  const generateCodeFromString = (input: string, attempt: number): string => {
    const cleaned = input.replace(/\s+/g, "");
    const offset = Math.floor(Math.random() * Math.min(3, cleaned.length));
    const letters = [...Array(6)]
      .map((_, i) => {
        const index = Math.floor((i * (cleaned.length - 1)) / 5) + offset;
        return cleaned[index % cleaned.length] || "";
      })
      .join("")
      .toUpperCase();
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    return letters + yearSuffix;
  };

  const hasAtLeastSimilarChars = (code1: string, code2: string): boolean => {
    let count = 0;
    for (let i = 0; i < Math.min(code1.length, code2.length); i++) {
      if (code1[i] === code2[i]) count++;
      if (count >= MIN_SIMILAR_CHARS) return true;
    }
    return false;
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateCodeFromString(name, attempt);

    const institutions = await prisma.institution.findMany({
      select: { code: true },
    });

    const tooSimilar = institutions.some((inst) =>
      hasAtLeastSimilarChars(code, inst.code || "")
    );

    if (!tooSimilar) {
      return code;
    }
  }

  throw new Error(
    "Could not generate unique institution code after multiple attempts"
  );
}
