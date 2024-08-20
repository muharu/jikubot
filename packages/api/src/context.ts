import constants from "./common/constants";
import cookies from "./common/cookies";
import discord from "./common/discord";
import utils from "./common/utils";
import auth from "./services/auth.service";

/**
 * Creates and returns the common context used across various parts of the application.
 * This context includes shared constants, cookies management, Discord API utilities, and other utilities.
 *
 * @returns {object} An object containing common modules and utilities.
 */
export function createCommonContext() {
  return { constants, cookies, discord, utils };
}

/**
 * Creates and returns the service context specifically for service-level dependencies.
 * This context includes the authentication service.
 *
 * @returns {object} An object containing service-level modules.
 */
export function createServiceContext() {
  return { auth };
}

/**
 * Type representing the structure of the common context.
 *
 * @typedef {ReturnType<typeof createCommonContext>} CommonContext
 */
export type CommonContext = ReturnType<typeof createCommonContext>;

/**
 * Type representing the structure of the service context.
 *
 * @typedef {ReturnType<typeof createServiceContext>} ServiceContext
 */
export type ServiceContext = ReturnType<typeof createServiceContext>;
