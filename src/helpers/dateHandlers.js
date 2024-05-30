export function dateShort(theDate) {
  return new Intl.DateTimeFormat("en-GB").format(theDate);
}

export function isDatePassed(aDate) {
  if (new Date() > aDate) return true;
  else return false;
}

export function hoursDifference(date1, date2) {
  return (date1 - date2) / 3600000;
}
