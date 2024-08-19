class Generator {
  public generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const charactersLength = characters.length;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public generateDiscordAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: String(process.env.AUTH_DISCORD_ID),
      redirect_uri: String(process.env.API_BASE_URL + "/authorize"),
      response_type: "code",
      scope: "identify email guilds",
      state,
    });
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }
}

const generator = new Generator();
export default generator;
