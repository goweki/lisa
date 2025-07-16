/**
 * Validates an email address.
 *
 * @param {string} email - The email string to validate.
 * @returns {string} - An error message if invalid, otherwise an empty string.
 */
export function emailValidator(email: string): string {
  const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

  if (!email) return "Email can't be empty.";
  if (!EMAIL_REGEX.test(email)) return "Ooops! We need a valid email address.";
  return "";
}

/**
 * Validates a password (minimum 5 characters).
 *
 * @param {string} password - The password string to validate.
 * @returns {string} - An error message if invalid, otherwise an empty string.
 */
export function passwordValidator(password: string): string {
  if (!password) return "Password can't be empty";
  if (password.length < 5) return "Password must be at least 5 characters long";
  return "";
}

/**
 * Validates a name (must be at least 3 letters, containing only alphabets).
 *
 * @param {string} name - The name string to validate.
 * @returns {string} - An error message if invalid, otherwise an empty string.
 */
export function nameValidator(name: string): string {
  const NAME_REGEX = /^[a-zA-Z\s'-]{3,}$/;

  if (!name) return "Name field can't be empty";
  if (name.length < 3) return "Name too short";
  if (!NAME_REGEX.test(name)) return "Names should contain alphabets only";
  return "";
}

/**
 * Validates a Kenyan phone number (starting with +254 or 0 and followed by 9 digits).
 *
 * @param {string} tel - The phone number string to validate.
 * @returns {string} - An error message if invalid, otherwise an empty string.
 */
export function telValidator(tel: string): string {
  const TEL_REGEX = /^(?:\+254|0)\d{9}$/;

  if (!tel) return "Tel field can't be empty";
  if (!TEL_REGEX.test(tel))
    return "Sorry, we only support KENYAN phone numbers";
  return "";
}
