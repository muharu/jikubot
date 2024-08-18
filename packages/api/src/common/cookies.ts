import type { IncomingMessage, ServerResponse } from "http";

import type { CookieOptions, SameSiteOption } from "./lib/cookie-helper";
import { parseCookies, serializeCookie } from "./lib/cookie-helper";

export function setCookie(
  res: ServerResponse,
  name: string,
  value: string,
  options?: CookieOptions,
) {
  const serializedCookie = serializeCookie(name, value, {
    httpOnly: process.env.NODE_ENV === "production" ? true : options?.httpOnly,
    secure: process.env.NODE_ENV === "production" ? true : options?.secure,
    path: options?.path ?? "/",
    sameSite: options?.sameSite ?? "lax",
    expires: options?.expires,
    maxAge: options?.maxAge,
  });

  const existingCookies = res.getHeader("Set-Cookie");
  if (existingCookies) {
    if (Array.isArray(existingCookies)) {
      res.setHeader("Set-Cookie", [...existingCookies, serializedCookie]);
    } else if (typeof existingCookies === "string") {
      res.setHeader("Set-Cookie", [existingCookies, serializedCookie]);
    }
  } else {
    res.setHeader("Set-Cookie", serializedCookie);
  }
}

export function getCookie(
  req: IncomingMessage,
  name: string,
): string | undefined {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[name];
}

export function deleteCookie(
  res: ServerResponse,
  name: string,
  options?: {
    path?: string;
    sameSite?: SameSiteOption;
  },
) {
  const serializedCookie = serializeCookie(name, "", {
    expires: new Date(0),
    path: options?.path ?? "/",
    sameSite: options?.sameSite ?? "lax",
  });

  const existingCookies = res.getHeader("Set-Cookie");
  if (existingCookies) {
    if (Array.isArray(existingCookies)) {
      res.setHeader("Set-Cookie", [...existingCookies, serializedCookie]);
    } else if (typeof existingCookies === "string") {
      res.setHeader("Set-Cookie", [existingCookies, serializedCookie]);
    }
  } else {
    res.setHeader("Set-Cookie", serializedCookie);
  }
}

const cookies = {
  setCookie,
  getCookie,
  deleteCookie,
};

export default cookies;
