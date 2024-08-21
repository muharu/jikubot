import { db } from "@giverve/db";

const transaction = db.transaction.bind(db);

export default transaction;
