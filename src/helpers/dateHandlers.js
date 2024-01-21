export function dateShort(theDate) {
  return new Intl.DateTimeFormat("en-GB").format(theDate);
}
