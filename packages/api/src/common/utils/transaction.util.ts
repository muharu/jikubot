import { db } from "@giverve/db";

export const transaction = db.transaction.bind(db);
