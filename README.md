# apa-aja

Bot Discord pribadi yang masuk dan tetap berada di voice channel. Nama proyek ini sengaja generik—ubah `name` di `package.json` kapan saja. Nama bot yang tampil di Discord diatur dari Developer Portal.

## Stack

- Node.js 22.12+ (LTS direkomendasikan)
- `discord.js` untuk Discord API dan slash command
- `@discordjs/voice` untuk koneksi voice
- `.env` untuk token rahasia

Tidak ada database, dashboard, atau web server karena bot saat ini hanya perlu AFK di voice.

## Setup lokal

1. Instal Node.js versi LTS dari [nodejs.org](https://nodejs.org/). Tutup lalu buka ulang terminal setelah instalasi.
2. Di folder proyek, jalankan:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

3. Isi `DISCORD_TOKEN` dan `DISCORD_GUILD_ID` di file `.env`.
4. Periksa konfigurasi dasar:

   ```powershell
   npm test
   ```

5. Jalankan bot:

   ```powershell
   npm start
   ```

Bot harus tetap berjalan di terminal atau pada hosting agar terus berada di voice channel.

Untuk hosting dengan Pterodactyl, ikuti [panduan deploy Pterodactyl](DEPLOYMENT_PTERODACTYL.md).

## Discord Developer Portal

1. Buka [Discord Developer Portal](https://discord.com/developers/applications) lalu **New Application**. Ubah namanya sesukamu.
2. Buka menu **Bot** → **Reset Token** → salin token ke `DISCORD_TOKEN` dalam `.env`. Jangan bagikan atau commit token ini.
3. Dari **General Information**, salin **Application ID** bila diperlukan untuk membuat tautan undangan.
4. Buka **OAuth2 → URL Generator**. Pilih scopes `bot` dan `applications.commands`.
5. Pada **Bot Permissions**, pilih minimal **View Channels** dan **Connect**. Salin URL yang terbentuk, buka di browser, lalu undang bot ke server pribadimu.
6. Aktifkan Developer Mode di Discord (`User Settings → Advanced`), klik kanan server target, pilih **Copy Server ID**, lalu masukkan ke `DISCORD_GUILD_ID`.

Tidak perlu menyalakan privileged intent untuk bot ini.

## Pemakaian

Masuk ke voice channel terlebih dahulu, kemudian jalankan:

```
/afk
```

Bot akan masuk ke channel yang sama dalam sekitar 20 detik atau menampilkan pesan izin yang kurang. Hanya anggota dengan izin **Manage Server** yang dapat menjalankan perintah ini. Untuk mengeluarkan bot:

```
/keluar
```

Slash command didaftarkan khusus ke server pada `DISCORD_GUILD_ID`, sehingga biasanya langsung muncul setelah bot berhasil menyala.

## Catatan keamanan

- `.env` sudah diabaikan Git; pastikan token hanya ada di sana atau di environment variable hosting.
- Jika token pernah terkirim ke chat, Git, atau screenshot, reset token di Developer Portal segera.
- Untuk channel privat, role bot tetap harus punya **View Channel** dan **Connect** pada permission overwrite channel tersebut.
