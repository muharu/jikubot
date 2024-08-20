import { db } from "@giverve/db";

import discord from "../common/discord";
import tokenRepository from "../repositories/token.repository";
import userRepository from "../repositories/user.repository";

class Repositories {
  protected userRepository = userRepository;
  protected tokenRepository = tokenRepository;
}

export class BaseService extends Repositories {
  protected fetch = discord.fetch;
  protected routes = discord.routes;
  protected transaction = db.transaction.bind(db);
}
