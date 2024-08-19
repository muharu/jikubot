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

export class JWT {
  private secret: string;
  private algorithm: JWTHeaderParameters["alg"];
  private maxAge: MaxAgeFormat;

  constructor(secret: string, maxAge: MaxAgeFormat = DEFAULT_JWT_MAX_AGE) {
    this.secret = secret;
    this.algorithm = DEFAULT_JWT_ALGORITHM;
    this.maxAge = maxAge;
  }

  async signJWT<T extends JWTPayload>(
    payload: T,
    maxAge?: number | string | Date,
  ): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setExpirationTime(maxAge ?? this.maxAge)
      .sign(new TextEncoder().encode(this.secret));

    return jwt;
  }

  async verifyJWT<T extends JWTPayload = ExtendedPayload>(
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

  decodeJWT<T extends JWTPayload = ExtendedPayload>(token: string): T | null {
    const decoded = joseDecodeJwt(token);
    return decoded as T;
  }
}

const jwt = new JWT(String(process.env.AUTH_SECRET));
export default jwt;
