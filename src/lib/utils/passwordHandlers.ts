import bcrypt from "bcrypt";
const saltRounds = Number(process.env.BCRYPT_SALTROUNDS || 9);
import crypto from "crypto";

// To hash a password
export async function hash(plaintext: string) {
  const hash = await bcrypt.hash(plaintext, saltRounds);
  return hash;
}

// To compare input&hash
export async function compareHash(input: string, hash: string) {
  const isValid = await bcrypt.compare(input, hash);
  return isValid;
}

export async function generateRandom(length: number = 11): Promise<string> {
  const hashedToken = crypto.randomBytes(length).toString("hex");
  return hashedToken;
}

export async function generateResetToken(): Promise<{
  plain: string;
  hashed: string;
  expiry: Date;
}> {
  const plain = await generateRandom(11);
  const hashed = await hash(plain);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return { plain, hashed, expiry };
}

export async function generatePin(): Promise<number> {
  const pin = Math.floor(1000 + Math.random() * 9000);

  return pin;
}

export async function buildResetUrlTail(token: string, username: string) {
  return `${token}/?username=${encodeURIComponent(username)}`;
}
