import type { JWTHeaderParameters, JWTPayload } from "jose";
import {
  decodeJwt as joseDecodeJwt,
  jwtVerify as joseVerifyJwt,
  SignJWT,
} from "jose";

import type { ExtendedJWTPayload } from "../types";

const DEFAULT_JWT_ALGORITHM: JWTHeaderParameters["alg"] = "HS256";
const DEFAULT_JWT_MAX_AGE = "1h";
const DEFAULT_AUTH_SECRET = String(process.env.AUTH_SECRET);

export type MaxAgeFormat = string | number | Date;

export async function signJWT(
  payload: JWTPayload,
  maxAge: MaxAgeFormat = DEFAULT_JWT_MAX_AGE,
  secret: string = DEFAULT_AUTH_SECRET,
  algorithm: JWTHeaderParameters["alg"] = DEFAULT_JWT_ALGORITHM,
): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setExpirationTime(maxAge)
    .sign(new TextEncoder().encode(secret));
  return jwt;
}

export async function verifyJWT<T = ExtendedJWTPayload>(
  token: string,
  secret: string = DEFAULT_AUTH_SECRET,
  algorithm: JWTHeaderParameters["alg"] = DEFAULT_JWT_ALGORITHM,
): Promise<T> {
  const { payload } = await joseVerifyJwt(
    token,
    new TextEncoder().encode(secret),
    {
      algorithms: [algorithm],
    },
  );
  return payload as T;
}

export function decodeJWT<T = ExtendedJWTPayload>(token: string): T | null {
  const decoded = joseDecodeJwt(token);
  return decoded as T;
}
