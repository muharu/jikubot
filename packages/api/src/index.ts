import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { common, repositories, services } from "./context";
import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

const createCaller = createCallerFactory(appRouter);

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export {
  appRouter,
  common,
  createCaller,
  createTRPCContext,
  repositories,
  services,
};

export type { AppRouter, RouterInputs, RouterOutputs };
