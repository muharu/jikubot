import type { JWTHeaderParameters, JWTPayload } from "jose";
import {
  decodeJwt as joseDecodeJwt,
  jwtVerify as joseVerifyJwt,
  SignJWT,
} from "jose";

const DEFAULT_JWT_ALGORITHM: JWTHeaderParameters["alg"] = "HS256";
const DEFAULT_JWT_MAX_AGE = "1h";

export type MaxAgeFormat = string | number | Date;

export interface ExtendedPayload extends JWTPayload {
  id: number;
  username: string;
  email: string;
  avatar: string;
  globalName: string;
}

export class JWTUtils {
  private secret: string;
  private algorithm: JWTHeaderParameters["alg"];
  private maxAge: MaxAgeFormat;

  constructor(secret: string) {
    if (!secret || typeof secret !== "string") {
      throw new Error("JWTUtils: secret must be a non-empty string");
    }

    this.secret = secret;
    this.algorithm = DEFAULT_JWT_ALGORITHM;
    this.maxAge = DEFAULT_JWT_MAX_AGE;
  }

  public async signJWT<T extends JWTPayload>(
    payload: T,
    maxAge?: MaxAgeFormat,
  ): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setExpirationTime(maxAge ?? this.maxAge)
      .sign(new TextEncoder().encode(this.secret));
    return jwt;
  }

  public async verifyJWT<T extends JWTPayload = ExtendedPayload>(
    token: string,
  ): Promise<T> {
    const { payload } = await joseVerifyJwt(
      token,
      new TextEncoder().encode(this.secret),
      {
        algorithms: [this.algorithm],
      },
    );
    return payload as T;
  }

  public decodeJWT<T extends JWTPayload = ExtendedPayload>(
    token: string,
  ): T | null {
    const decoded = joseDecodeJwt(token);
    return decoded as T;
  }
}

export type { JWTPayload } from "jose";
