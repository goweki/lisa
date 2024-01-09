import bcrypt from "bcrypt";

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

// To hash a password
export function hash(plaintext) {
  return bcrypt.hash(plaintext, saltRounds, (err, hash) => {
    // ifSuccess
    if (hash) {
      return { success: hash };
    }
    // ifError
    else {
      console.error(
        `........................\nERROR: Hashing handler\n > ${err}\n..................`
      );
      return { error: "hashing failed" };
    }
  });
}

// To check a password
// Load hash from your password DB.
export function compareHash(input, hash) {
  return bcrypt.compare(input, hash, (err, res) => {
    // ifError
    if (err) {
      return { error: "Hashing failed" };
    }
    // ifMatch
    if (res) {
      return { success: true };
    } else {
      // response is OutgoingMessage object that server response http request
      return { failed: false };
    }
  });
}
