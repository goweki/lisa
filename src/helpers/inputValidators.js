export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) {
    return "Email can't be empty.";
  } else if (!re.test(email)) {
    return "Ooops! We need a valid email address.";
  } else return "";
}

export function passwordValidator(password) {
  if (!password) {
    return "Password can't be empty";
  } else if (password.length < 5) {
    return "Password must be at least 5 characters long";
  } else return "";
}
