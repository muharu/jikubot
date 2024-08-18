import { db } from "@giverve/db";

export const createDbTransaction = db.transaction.bind(db);
