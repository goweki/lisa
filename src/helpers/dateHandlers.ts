/**
 * Formats a given date as a short string (e.g., "15/07/2025") using "en-GB" locale.
 *
 * @param {Date} theDate - The date to format.
 * @returns {string} - The formatted date string.
 */
export function dateShort(theDate: Date): string {
  return new Intl.DateTimeFormat("en-GB").format(theDate);
}

/**
 * Determines whether a given date has already passed (compared to current time).
 *
 * @param {Date} aDate - The date to check.
 * @returns {boolean} - `true` if the date is in the past, `false` otherwise.
 */
export function isDatePassed(aDate: Date): boolean {
  return Date.now() > aDate.getTime();
}

/**
 * Calculates the difference in hours between two dates.
 *
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {number} - The difference in hours (positive if `date1` > `date2`).
 */
export function hoursDifference(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / 3600000;
}
