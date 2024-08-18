import type { JWTHeaderParameters, JWTPayload } from "jose";
import {
  decodeJwt as joseDecodeJwt,
  jwtVerify as joseVerifyJwt,
  SignJWT,
} from "jose";

const JWT_SECRET = String(process.env.AUTH_SECRET);
const DEFAULT_JWT_ALGORITHM: JWTHeaderParameters["alg"] = "HS256";
const DEFAULT_JWT_MAX_AGE = "1h";

async function signJWT(
  payload: JWTPayload,
  maxAge?: number | string | Date,
): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: DEFAULT_JWT_ALGORITHM })
    .setExpirationTime(maxAge ?? DEFAULT_JWT_MAX_AGE)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return jwt;
}

async function verifyJWT(token: string): Promise<JWTPayload> {
  const { payload } = await joseVerifyJwt(
    token,
    new TextEncoder().encode(JWT_SECRET),
    {
      algorithms: [DEFAULT_JWT_ALGORITHM],
    },
  );
  return payload;
}

function decodeJWT(token: string): JWTPayload | null {
  const decoded = joseDecodeJwt(token);
  return decoded;
}

export { decodeJWT, signJWT, verifyJWT };
