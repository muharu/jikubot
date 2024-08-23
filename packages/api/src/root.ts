import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
