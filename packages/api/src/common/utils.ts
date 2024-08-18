import CryptoHandler from "./lib/encryption";

const cryptoHandler = new CryptoHandler(String(process.env.AUTH_SECRET), {
  encoding: "base64url",
  saltLength: 10,
});

export function encryptString(str: string) {
  return cryptoHandler.encrypt(str);
}

export function decryptString(str: string) {
  return cryptoHandler.decrypt(str);
}

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateDiscordAuthorizationUrl(state: string) {
  const params = new URLSearchParams({
    client_id: String(process.env.AUTH_DISCORD_ID),
    redirect_uri: String(process.env.API_BASE_URL + "/authorize"),
    response_type: "code",
    scope: "identify email guilds",
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

const utils = {
  generateRandomString,
  generateDiscordAuthorizationUrl,
  encryptString,
  decryptString,
};

export default utils;
