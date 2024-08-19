export type SameSiteOption = "strict" | "lax" | "none";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: SameSiteOption;
  expires?: Date;
  maxAge?: number;
}

class CookieManager {
  public serialize(
    name: string,
    value: string,
    options: CookieOptions = {},
  ): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookie += `; expires=${options.expires.toUTCString()}`;
    } else if (options.maxAge) {
      cookie += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookie += `; path=${options.path}`;
    }

    if (options.secure) {
      cookie += "; secure";
    }

    if (options.httpOnly) {
      cookie += "; HttpOnly";
    }

    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite}`;
    }

    return cookie;
  }

  public parse(cookieHeader?: string): Record<string, string> {
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
}

const cookieHelper = new CookieManager();
export default cookieHelper;
