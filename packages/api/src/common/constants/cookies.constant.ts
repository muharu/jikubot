const {
  COOKIE_REFRESH_TOKEN_NAME: ENV_COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_ACCESS_TOKEN_NAME: ENV_COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_OAUTH_STATE_NAME: ENV_COOKIE_OAUTH_STATE_NAME,
  COOKIE_JWT_NAME: ENV_COOKIE_JWT_NAME,
} = process.env;

export const COOKIE_REFRESH_TOKEN_NAME =
  ENV_COOKIE_REFRESH_TOKEN_NAME ?? "_ry613q";

export const COOKIE_ACCESS_TOKEN_NAME =
  ENV_COOKIE_ACCESS_TOKEN_NAME ?? "_721r1z";

export const COOKIE_OAUTH_STATE_NAME = ENV_COOKIE_OAUTH_STATE_NAME ?? "_1r2y3k";

export const COOKIE_JWT_NAME = ENV_COOKIE_JWT_NAME ?? "_1xy56kv";
