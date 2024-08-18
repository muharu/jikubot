import type { IncomingMessage, ServerResponse } from "http";

type SameSiteOption = "strict" | "lax" | "none";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: SameSiteOption;
  expires?: Date;
  maxAge?: number;
}

function serializeCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): string {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options?.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  } else if (options?.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }

  if (options?.path) {
    cookie += `; path=${options.path}`;
  }

  if (options?.secure) {
    cookie += "; secure";
  }

  if (options?.httpOnly) {
    cookie += "; HttpOnly";
  }

  if (options?.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  return cookie;
}

function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (cookieHeader) {
    const cookiesArray = cookieHeader.split(";");
    cookiesArray.forEach((cookie) => {
      const [name, ...rest] = cookie.split("=");
      if (name) {
        const value = rest.join("=").trim();
        cookies[decodeURIComponent(name.trim())] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
}

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
