export const COOKIE_REFRESH_TOKEN_NAME = process.env.COOKIE_REFRESH_TOKEN_NAME
  ? String(process.env.COOKIE_REFRESH_TOKEN_NAME)
  : "_ry613q";

export const COOKIE_ACCESS_TOKEN_NAME = process.env.COOKIE_ACCESS_TOKEN_NAME
  ? String(process.env.COOKIE_ACCESS_TOKEN_NAME)
  : "_721r1z";

export const COOKIE_OAUTH_STATE_NAME = process.env.COOKIE_OAUTH_STATE_NAME
  ? String(process.env.COOKIE_OAUTH_STATE_NAME)
  : "_1r2y3k";

export const COOKIE_JWT_NAME = process.env.COOKIE_JWT_NAME
  ? String(process.env.COOKIE_JWT_NAME)
  : "_1xy56kv";

const constants = {
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_OAUTH_STATE_NAME,
  COOKIE_JWT_NAME,
};

export default constants;
