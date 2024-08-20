import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { createCommonContext } from "./context";
import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

const createCaller = createCallerFactory(appRouter);
const common = createCommonContext();

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { appRouter, common, createCaller, createTRPCContext };

export type { AppRouter, RouterInputs, RouterOutputs };
