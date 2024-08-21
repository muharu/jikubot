import * as cookieConstants from "./common/constants/cookies.constant";
import * as cookieUtils from "./common/utils/cookies.util";
import * as cryptoUtils from "./common/utils/crypto.util";
import * as discordUtils from "./common/utils/discord.util";
import * as jwtUtils from "./common/utils/jwt.util";
import dbTransactionUtils from "./common/utils/transaction.util";
import * as tokenRepository from "./repositories/token.repository";
import * as userRepository from "./repositories/user.repository";
import * as authSchema from "./schemas/auth.schema";
import * as authService from "./services/auth.service";

export const common = createCommonContext();
export const services = createServiceContext();
export const schemas = createSchemaContext();
export const repositories = createRepositoryContext();

function createCommonContext() {
  return {
    utils: createUtilsContext(),
    constants: createConstantsContext(),
  };
}

function createServiceContext() {
  return { auth: authService };
}

function createSchemaContext() {
  return {
    auth: authSchema,
  };
}

function createRepositoryContext() {
  return {
    token: tokenRepository,
    user: userRepository,
  };
}

function createUtilsContext() {
  return {
    cookies: cookieUtils,
    crypto: cryptoUtils,
    discord: discordUtils,
    jwt: jwtUtils,
    transaction: dbTransactionUtils,
  };
}

function createConstantsContext() {
  return {
    ...cookieConstants,
  };
}
