import { authRouter } from "./routers/auth.router";
import { botRouter } from "./routers/bot.router";
import { userRouter } from "./routers/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  bot: botRouter,

  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
