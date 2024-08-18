import type { IncomingMessage } from "http";
import type { ParsedUrlQuery } from "querystring";

import { API_CONSTANTS } from "@giverve/api";

import { getCookie } from "./cookies";

interface AuthorizeServerSideParams {
  req: IncomingMessage;
  query: ParsedUrlQuery;
}

export function authorizeServerSide({ req, query }: AuthorizeServerSideParams) {
  const stateFromCookie = getCookie(req, API_CONSTANTS.COOKIE_OAUTH_STATE_NAME);
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
