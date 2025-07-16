/**
 * Recursively excludes specified fields from an object or array of objects.
 * @template T - The input type.
 * @param {T} items - The object or array of objects to process.
 * @param {string[]} keys - An array of field names to exclude.
 * @returns {T} - A new object or array with specified fields removed.
 *
 * @example
 * const user = { name: 'Alice', password: 'secret', profile: { password: 'hidden' } };
 * excludeFields(user, ['password']);
 * // => { name: 'Alice', profile: {} }
 *
 * @example
 * const users = [{ name: 'A', password: 'x' }, { name: 'B', password: 'y' }];
 * excludeFields(users, ['password']);
 * // => [{ name: 'A' }, { name: 'B' }]
 */
export function excludeFields<T>(items: T, keys: string[]): T {
  if (Array.isArray(items)) {
    // Recursively process each item in the array
    return items.map((item) => excludeFields(item, keys)) as T;
  }

  if (items !== null && typeof items === "object") {
    // Filter and reconstruct the object excluding specified keys
    const filteredEntries = Object.entries(items)
      .filter(([key]) => !keys.includes(key)) // Exclude keys
      .map(([key, value]) => [key, excludeFields(value, keys)]); // Recurse

    return Object.fromEntries(filteredEntries) as T;
  }

  // Return primitive values unchanged
  return items;
}

/**
 * Checks whether two arrays contain the same elements with the same frequency,
 * regardless of their order.
 * @template T - The type of elements in the arrays.
 * @param {T[]} a - The first array to compare.
 * @param {T[]} b - The second array to compare.
 * @returns {boolean} - `true` if both arrays have the same elements in the same quantities, else `false`.
 *
 * @example
 * arraysHaveSameElements([1, 2, 2, 3], [3, 2, 1, 2]); // true
 * arraysHaveSameElements([1, 2, 3], [3, 2, 2]);       // false
 * arraysHaveSameElements(['a', 'b'], ['b', 'a']);     // true
 */
export function arraysHaveSameElements<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;

  const counts = new Map<T, number>();

  // Count elements in array `a`
  for (const item of a) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  // Decrease counts based on array `b`
  for (const item of b) {
    const current = counts.get(item);
    if (!current) return false; // Either missing or count would go negative
    if (current === 1) {
      counts.delete(item);
    } else {
      counts.set(item, current - 1);
    }
  }

  // All counts should be zero, map should be empty
  return counts.size === 0;
}
