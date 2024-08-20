import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const DEFAULT_ENCODING: BufferEncoding = "base64";
const DEFAULT_SALT_LENGTH = 10;
const DEFAULT_PBKDF2_ITERATIONS = 100000;
const DEFAULT_AUTH_SECRET = String(process.env.AUTH_SECRET);

export class CryptoUtils {
  private secret: string;
  private encoding: BufferEncoding;
  private saltLength: number;
  private pbkdf2Iterations: number;

  constructor(secret?: string, options?: CryptoUtilsOptions) {
    this.secret = secret ?? DEFAULT_AUTH_SECRET;
    this.encoding = options?.encoding ?? DEFAULT_ENCODING;
    this.saltLength = options?.saltLength ?? DEFAULT_SALT_LENGTH;
    this.pbkdf2Iterations =
      options?.pbkdf2Iterations ?? DEFAULT_PBKDF2_ITERATIONS;
  }

  private getKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.secret,
      salt,
      this.pbkdf2Iterations,
      32,
      "sha512",
    );
  }

  public encryptString(value: string): string {
    if (!value) {
      throw new Error("Value must not be null or undefined");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(this.saltLength);
    const key = this.getKey(salt);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString(this.encoding);
  }

  public decryptString(encryptedValue: string): string {
    if (!encryptedValue) {
      throw new Error("Value must not be null or undefined");
    }

    const buffer = Buffer.from(encryptedValue, this.encoding);

    const salt = buffer.subarray(0, this.saltLength);
    const iv = buffer.subarray(this.saltLength, this.saltLength + IV_LENGTH);
    const tag = buffer.subarray(
      this.saltLength + IV_LENGTH,
      this.saltLength + IV_LENGTH + TAG_LENGTH,
    );
    const encrypted = buffer.subarray(this.saltLength + IV_LENGTH + TAG_LENGTH);

    const key = this.getKey(salt);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  }

  public generateRandomString(length = 32): string {
    const bytes = crypto.randomBytes(length);
    return bytes.toString("base64").replace(/\+/g, "-").replace(/=+$/, "");
  }
}

export interface CryptoUtilsOptions {
  encoding?: BufferEncoding;
  pbkdf2Iterations?: number;
  saltLength?: number;
}
