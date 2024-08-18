import type { NextApiResponse } from "@trpc/server/adapters/next";
import type { CookieSerializeOptions } from "cookie";
import cookie from "cookie";

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  options?: CookieSerializeOptions,
) {
  const serializedCookie = cookie.serialize(name, value, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    ...options,
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

export const cookies = {
  setCookie,
};
