import * as tokenRepository from "./token.repository";
import * as userRepository from "./user.repository";

const repositories = {
  token: tokenRepository,
  user: userRepository,
};

export default repositories;
