import constants from "./common/constants";
import cookies from "./common/cookies";
import discord from "./common/discord";
import utils from "./common/utils";
import auth from "./services/auth.service";

export function createCommonContext() {
  return { constants, cookies, discord, utils };
}

export function createServiceContext() {
  return { auth };
}

export type CommonContext = ReturnType<typeof createCommonContext>;
export type ServiceContext = ReturnType<typeof createServiceContext>;
