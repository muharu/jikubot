import { db } from "@giverve/db";

import discord from "../common/discord";
import tokenRepository from "../repositories/token.repository";
import userRepository from "../repositories/user.repository";

/**
 * Repositories serves as a base class for repository services.
 */
class Repositories {
  /**
   * An instance of `userRepository` for performing user-related database operations.
   * @protected
   */
  protected userRepository = userRepository;

  /**
   * An instance of `tokenRepository` for performing token-related database operations.
   * @protected
   */
  protected tokenRepository = tokenRepository;
}

/**
 * BaseService extends `Repositories` and provides additional functionality.
 * It includes methods for interacting with Discord's API and handling database transactions.
 */
export class BaseService extends Repositories {
  /**
   * The `fetch` function for making HTTP requests to Discord's API.
   * @protected
   */
  protected fetch = discord.fetch;

  /**
   * An object containing the routes for interacting with Discord's API.
   * @protected
   */
  protected routes = discord.routes;

  /**
   * A bound method for performing database transactions.
   * @protected
   */
  protected transaction = db.transaction.bind(db);
}
