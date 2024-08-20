import type { CookieParseOptions, CookieSerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";

export class Cookies {
  private serialize(
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ): string {
    return serializeCookie(name, value, options);
  }

  private parse(
    cookieHeader?: string,
    options?: CookieParseOptions,
  ): Record<string, string> {
    return cookieHeader != null && cookieHeader !== ""
      ? parseCookie(cookieHeader, options)
      : {};
  }

  public setCookie(
    res: ServerResponse,
    name: string,
    value: string,
    options: CookieSerializeOptions = {},
  ) {
    const serializedCookie = this.serialize(name, value, {
      httpOnly: options.httpOnly ?? process.env.NODE_ENV === "production",
      secure: options.secure ?? process.env.NODE_ENV === "production",
      path: options.path ?? "/",
      sameSite: options.sameSite ?? "lax",
      expires: options.expires,
      maxAge: options.maxAge,
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
    const cookies = this.parse(cookieHeader);
    return cookies[name];
  }

  public deleteCookie(
    res: ServerResponse,
    name: string,
    options?: CookieSerializeOptions,
  ) {
    const serializedCookie = this.serialize(name, "", {
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

export default new Cookies();
