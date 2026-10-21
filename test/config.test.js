import assert from 'node:assert/strict';
import test from 'node:test';
import { getConfig } from '../src/config.js';

test('mengembalikan konfigurasi yang sudah dibersihkan', () => {
  assert.deepEqual(getConfig({ DISCORD_TOKEN: ' token ', DISCORD_GUILD_ID: ' guild ' }), {
    token: 'token',
    guildId: 'guild',
  });
});

test('menolak konfigurasi yang belum lengkap', () => {
  assert.throws(() => getConfig({ DISCORD_TOKEN: 'token' }), /DISCORD_GUILD_ID/);
});
