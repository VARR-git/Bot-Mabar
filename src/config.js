const REQUIRED_KEYS = ['DISCORD_TOKEN', 'DISCORD_GUILD_ID'];

export function getConfig(environment = process.env) {
  const missing = REQUIRED_KEYS.filter((key) => !environment[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Variabel .env belum diisi: ${missing.join(', ')}`);
  }

  return {
    token: environment.DISCORD_TOKEN.trim(),
    guildId: environment.DISCORD_GUILD_ID.trim(),
  };
}
