import * as cookieConstants from "./constants/cookies.constant";
import * as cookieUtils from "./utils/cookies.util";
import * as cryptoUtils from "./utils/crypto.util";
import * as discordUtils from "./utils/discord.util";
import * as jwtUtils from "./utils/jwt.util";
import transaction from "./utils/transaction.util";

const common = {
  cookies: cookieUtils,
  crypto: cryptoUtils,
  discord: discordUtils,
  jwt: jwtUtils,
  transaction,
  constants: {
    ...cookieConstants,
  },
};

export default common;
