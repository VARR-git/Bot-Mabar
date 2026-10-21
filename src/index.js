import 'dotenv/config';
import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import {
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { commands } from './commands.js';
import { getConfig } from './config.js';

const config = getConfig();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Login sebagai ${readyClient.user.tag}`);

  try {
    await readyClient.application.commands.set(commands, config.guildId);
    console.log('Slash command siap dipakai.');
  } catch (error) {
    console.error('Gagal mendaftarkan slash command:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || !interaction.inGuild()) return;

  if (interaction.commandName === 'keluar') {
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
      await interaction.reply({ content: 'Bot sedang tidak berada di voice channel.', flags: MessageFlags.Ephemeral });
      return;
    }

    connection.destroy();
    await interaction.reply({ content: 'Bot keluar dari voice channel.', flags: MessageFlags.Ephemeral });
    return;
  }

  if (interaction.commandName !== 'afk') return;

  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({ content: 'Masuk ke voice channel dulu, lalu jalankan `/afk` lagi.', flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: true,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    await interaction.editReply(`Bot sekarang AFK di **${voiceChannel.name}**.`);
  } catch (error) {
    connection.destroy();
    console.error('Gagal masuk voice channel:', error);
    await interaction.editReply('Gagal masuk voice channel. Pastikan bot punya izin View Channel dan Connect.');
  }
});

client.on(Events.Error, (error) => console.error('Discord client error:', error));
client.login(config.token);
