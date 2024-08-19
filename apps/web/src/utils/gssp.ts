import type { IncomingMessage, ServerResponse } from "http";
import type { ParsedUrlQuery } from "querystring";

import { constants, cookies, utils } from "@giverve/api";

interface AuthorizeServerSideParams {
  req: IncomingMessage;
  query: ParsedUrlQuery;
}

const {
  COOKIE_OAUTH_STATE_NAME,
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_JWT_NAME,
} = constants;

export function checkAuthorizeServerSide({
  req,
  query,
}: AuthorizeServerSideParams) {
  const stateFromCookie = cookies.getCookie(req, COOKIE_OAUTH_STATE_NAME);
  const stateFromUrlQuery = query.state as string;
  const codeFromUrlQuery = query.code as string;

  if (!stateFromCookie || !stateFromUrlQuery || !codeFromUrlQuery) {
    return Promise.resolve({
      redirect: {
        destination: "/login",
        permanent: false,
      },
    });
  }

  if (stateFromCookie !== stateFromUrlQuery) {
    return Promise.resolve({
      redirect: {
        destination: "/login",
        permanent: false,
      },
    });
  }

  return Promise.resolve({
    props: {
      code: codeFromUrlQuery,
      state: stateFromCookie,
    },
  });
}

export async function checkHasLoggedInServerSide({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const accessToken = cookies.getCookie(req, COOKIE_ACCESS_TOKEN_NAME);
  const refreshToken = cookies.getCookie(req, COOKIE_REFRESH_TOKEN_NAME);
  const jwt = cookies.getCookie(req, COOKIE_JWT_NAME);

  if (!accessToken || !refreshToken || !jwt) {
    return {
      props: {},
    };
  }

  try {
    if (accessToken && refreshToken && jwt) {
      utils.decryptString(accessToken);
      utils.decryptString(refreshToken);
      const decryptedJwt = utils.decryptString(jwt);

      await utils.verifyJWT(decryptedJwt);

      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error(error);
    clearCookies(res);
    return {
      props: {},
    };
  }
}

export async function checkIsLoggedInServerSide({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const accessToken = cookies.getCookie(req, COOKIE_ACCESS_TOKEN_NAME);
  const refreshToken = cookies.getCookie(req, COOKIE_REFRESH_TOKEN_NAME);
  const jwt = cookies.getCookie(req, COOKIE_JWT_NAME);

  if (!accessToken || !refreshToken || !jwt) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    if (accessToken && refreshToken && jwt) {
      utils.decryptString(accessToken);
      utils.decryptString(refreshToken);
      const decryptedJwt = utils.decryptString(jwt);

      await utils.verifyJWT(decryptedJwt);

      return {
        props: {},
      };
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
    clearCookies(res);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

function clearCookies(res: ServerResponse) {
  cookies.deleteCookie(res, COOKIE_OAUTH_STATE_NAME);
  cookies.deleteCookie(res, COOKIE_ACCESS_TOKEN_NAME);
  cookies.deleteCookie(res, COOKIE_REFRESH_TOKEN_NAME);
  cookies.deleteCookie(res, COOKIE_JWT_NAME);
}
