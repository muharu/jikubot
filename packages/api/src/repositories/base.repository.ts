import { db } from "@giverve/db";

/**
 * BaseRepository provides a common database context for all repository classes.
 */
export class BaseRepository {
  /**
   * The database context used by the repository.
   * @protected
   */
  protected ctx = db;
}
