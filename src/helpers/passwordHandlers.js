import bcrypt from "bcrypt";
const saltRounds = Number(process.env.BCRYPT_SALTROUNDS);

// To hash a password
export function hash(plaintext) {
  return bcrypt.hash(plaintext, saltRounds, (err, hash) => {
    // ifSuccess
    if (hash) {
      return hash;
    }
    // ifError
    else {
      console.error(
        `........................\nERROR: Hashing failed\n > ${err}\n..................`
      );
      return null;
    }
  });
}

// To compare input&hash
export function compareHash(input, hash) {
  return bcrypt.compare(input, hash, (err, res) => {
    // ifMatch
    if (res) {
      return true;
    } else {
      // notMatch or error
      console.error(
        `........................\nFAILED: Hash comparison\n > ${
          err || "hashes did not match"
        }\n..................`
      );
      return false;
    }
  });
}
