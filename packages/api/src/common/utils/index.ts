import type { CryptoUtilsOptions } from "./crypto";
import type { ExtendedPayload, JWTPayload, MaxAgeFormat } from "./jwt";
import { CryptoUtils } from "./crypto";
import { JWTUtils } from "./jwt";

export class Utils {
  private cryptoUtils: CryptoUtils;
  private jwtUtils: JWTUtils;

  constructor(secret?: string, cryptoOptions?: CryptoUtilsOptions) {
    this.cryptoUtils = new CryptoUtils(secret, cryptoOptions);
    this.jwtUtils = new JWTUtils(secret);
  }

  public encryptString(value: string): string {
    return this.cryptoUtils.encryptString(value);
  }

  public decryptString(encryptedValue: string): string {
    return this.cryptoUtils.decryptString(encryptedValue);
  }

  public generateRandomString(length: number): string {
    return this.cryptoUtils.generateRandomString(length);
  }

  public async signJWT<T extends JWTPayload>(
    payload: T,
    maxAge?: MaxAgeFormat,
  ): Promise<string> {
    return this.jwtUtils.signJWT(payload, maxAge);
  }

  public async verifyJWT<T extends JWTPayload = ExtendedPayload>(
    token: string,
  ): Promise<T> {
    return this.jwtUtils.verifyJWT(token);
  }

  public decodeJWT<T extends JWTPayload = ExtendedPayload>(
    token: string,
  ): T | null {
    return this.jwtUtils.decodeJWT(token);
  }
}

export default new Utils();
