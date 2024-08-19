import type { JWTHeaderParameters, JWTPayload } from "jose";
import {
  decodeJwt as joseDecodeJwt,
  jwtVerify as joseVerifyJwt,
  SignJWT,
} from "jose";

const JWT_SECRET = String(process.env.AUTH_SECRET);
const DEFAULT_JWT_ALGORITHM: JWTHeaderParameters["alg"] = "HS256";
const DEFAULT_JWT_MAX_AGE = "1h";

interface ExtendedPayload extends JWTPayload {
  id: number;
  username: string;
  email: string;
  avatar: string;
  globalName: string;
}

async function signJWT<T extends JWTPayload>(
  payload: T,
  maxAge?: number | string | Date,
): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: DEFAULT_JWT_ALGORITHM })
    .setExpirationTime(maxAge ?? DEFAULT_JWT_MAX_AGE)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return jwt;
}

async function verifyJWT<T extends JWTPayload = ExtendedPayload>(
  token: string,
): Promise<T> {
  const { payload } = await joseVerifyJwt(
    token,
    new TextEncoder().encode(JWT_SECRET),
    {
      algorithms: [DEFAULT_JWT_ALGORITHM],
    },
  );
  return payload as T;
}

function decodeJWT<T extends JWTPayload = ExtendedPayload>(
  token: string,
): T | null {
  const decoded = joseDecodeJwt(token);
  return decoded as T;
}

export { decodeJWT, signJWT, verifyJWT };
