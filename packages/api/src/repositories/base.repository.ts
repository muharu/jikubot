import { db } from "@giverve/db";

export class BaseRepository {
  protected trx = db;
}
