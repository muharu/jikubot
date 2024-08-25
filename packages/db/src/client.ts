import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(String(process.env.POSTGRES_URL));
if (String(process.env.POSTGRES_URL) !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
