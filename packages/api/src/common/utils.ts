import { db } from "@giverve/db";

import type { ExtendedPayload } from "./lib/jwt";
import encrypter from "./lib/encrypter";
import generator from "./lib/generator";
import jwt from "./lib/jwt";

class Utils {
  private encrypter = encrypter;
  private generator = generator;
  private jwt = jwt;

  public createDbTransaction() {
    return db.transaction.bind(db);
  }

  public encryptString(str: string): string {
    return this.encrypter.encrypt(str);
  }

  public decryptString(str: string): string {
    return this.encrypter.decrypt(str);
  }

  public generateRandomString(length: number): string {
    return this.generator.generateRandomString(length);
  }

  public generateDiscordAuthorizationUrl(state: string): string {
    return this.generator.generateDiscordAuthorizationUrl(state);
  }

  public async signJWT<T extends ExtendedPayload>(
    payload: T,
    maxAge?: string | number | Date,
  ): Promise<string> {
    return this.jwt.signJWT(payload, maxAge);
  }

  public async verifyJWT<T extends ExtendedPayload>(token: string): Promise<T> {
    return this.jwt.verifyJWT<T>(token);
  }

  public decodeJWT<T extends ExtendedPayload>(token: string): T | null {
    return this.jwt.decodeJWT<T>(token);
  }
}

const utils = new Utils();
export default utils;
