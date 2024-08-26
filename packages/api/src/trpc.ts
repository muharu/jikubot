import type { IncomingMessage, ServerResponse } from "http";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { ExtendedJWTPayload, User } from "./common/types";
import { common } from "./context";

export const createTRPCContext = ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  return { req, res };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  common.utils.logger.info(
    `[PERFORMANCE] ${path} took ${end - start}ms to execute`,
  );
  return result;
});

const authMiddleware = t.middleware(async ({ ctx: { req }, next }) => {
  const accessTokenFromCookie = common.utils.cookies.getCookie(
    req,
    common.constants.COOKIE_ACCESS_TOKEN_NAME,
  );
  const refreshTokenFromCookie = common.utils.cookies.getCookie(
    req,
    common.constants.COOKIE_REFRESH_TOKEN_NAME,
  );
  const jwtFromCookie = common.utils.cookies.getCookie(
    req,
    common.constants.COOKIE_JWT_NAME,
  );

  if (!accessTokenFromCookie || !refreshTokenFromCookie || !jwtFromCookie) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  try {
    if (accessTokenFromCookie && refreshTokenFromCookie && jwtFromCookie) {
      const accessToken = common.utils.crypto.decryptString(
        accessTokenFromCookie,
      );
      const refreshToken = common.utils.crypto.decryptString(
        refreshTokenFromCookie,
      );
      const decryptedJwt = common.utils.crypto.decryptString(jwtFromCookie);

      const jwtPayload =
        await common.utils.jwt.verifyJWT<ExtendedJWTPayload>(decryptedJwt);

      const user: User = {
        id: jwtPayload.id,
        username: jwtPayload.username,
        email: jwtPayload.email,
        globalName: jwtPayload.globalName,
        avatar: jwtPayload.avatar,
      };

      return await next({
        ctx: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: process.env.NODE_ENV !== "production" && error,
    });
  }
});

const botMiddleware = t.middleware(async ({ next, ctx }) => {
  const authorization = ctx.req.headers.authorization;

  if (!authorization) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  if (token !== process.env.BOT_DISCORD_TOKEN) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return await next();
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const dashboardProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware);

export const botProcedure = t.procedure
  .use(timingMiddleware)
  .use(botMiddleware);
