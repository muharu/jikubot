import crypto from "crypto";
import Cryptr from "cryptr";

const SECRET_KEY = String(process.env.AUTH_SECRET);

const cryptr = new Cryptr(SECRET_KEY, {
  encoding: "base64",
  saltLength: 10,
});

export function generateRandomString(length = 32): string {
  const bytes = crypto.randomBytes(length);
  return bytes.toString("base64").replace(/\+/g, "-").replace(/=+$/, "");
}

export function encryptString(value: string): string {
  return cryptr.encrypt(value);
}

export function decryptString(value: string): string {
  return cryptr.decrypt(value);
}
