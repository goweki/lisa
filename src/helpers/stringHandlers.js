export function strTruncate(str, len) {
  if (str.length > len) return `${str.substring(0, len)} ...`;
  else return str;
}

export function strPascalcase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function strsMatch(str1, str2) {
  return str1 === str2;
}
