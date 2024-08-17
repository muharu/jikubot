import type { CookieSerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import cookie from "cookie";

export const setCookie = (
  res: ServerResponse,
  name: string,
  value: string,
  options: CookieSerializeOptions = {},
): void => {
  const cookieOptions: CookieSerializeOptions = {
    path: "/",
    ...options,
  };

  res.setHeader("Set-Cookie", cookie.serialize(name, value, cookieOptions));
};

export const getCookie = (
  req: IncomingMessage,
  name: string,
): string | undefined => {
  const cookies = cookie.parse(req.headers.cookie ?? "");
  return cookies[name];
};

export const deleteCookie = (
  res: ServerResponse,
  name: string,
  options: CookieSerializeOptions = {},
): void => {
  const cookieOptions: CookieSerializeOptions = {
    path: "/",
    ...options,
    expires: new Date(0),
  };

  res.setHeader("Set-Cookie", cookie.serialize(name, "", cookieOptions));
};
