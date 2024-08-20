import { authRouter } from "./routers/auth.router";
import { createTRPCRouter } from "./trpc";

/**
 * Creates the main application router by combining individual routers.
 *
 * The `appRouter` is the central router for the application, composed of various sub-routers
 * such as the `authRouter` which handles authentication-related routes.
 *
 * @type {ReturnType<typeof createTRPCRouter>}
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
});

/**
 * Type definition for the application's router.
 *
 * `AppRouter` represents the complete structure of the application's API, including all the sub-routers.
 * This type is used to infer the types for the entire routing system, enabling type-safe API calls.
 *
 * @typedef {typeof appRouter} AppRouter
 */
export type AppRouter = typeof appRouter;
