import type { IncomingMessage, ServerResponse } from "http";

import type { CookieOptions, SameSiteOption } from "./lib/cookie-helper";
import cookieHelper from "./lib/cookie-helper";

class Cookies {
  public setCookie(
    res: ServerResponse,
    name: string,
    value: string,
    options?: CookieOptions,
  ) {
    const serializedCookie = cookieHelper.serialize(name, value, {
      httpOnly:
        process.env.NODE_ENV === "production" ? true : options?.httpOnly,
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

  public getCookie(req: IncomingMessage, name: string) {
    const cookieHeader = req.headers.cookie;
    const cookies = cookieHelper.parse(cookieHeader);
    return cookies[name];
  }

  public deleteCookie(
    res: ServerResponse,
    name: string,
    options?: {
      path?: string;
      sameSite?: SameSiteOption;
    },
  ) {
    const serializedCookie = cookieHelper.serialize(name, "", {
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
}

const cookies = new Cookies();
export default cookies;
