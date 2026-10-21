# Deploy ke Pterodactyl

Panduan ini untuk panel Pterodactyl biasa, dengan akses sebagai user server. Bot tidak membutuhkan database, port, atau domain.

## 1. Buat server Node.js

Minta admin panel membuat server dari egg **node.js generic** (atau egg Node.js lain), dengan image Node.js **22** atau lebih baru. Proyek ini membutuhkan Node.js `22.12.0+`.

Rekomendasi resource awal:

| Resource | Nilai |
| --- | --- |
| RAM | 256 MB |
| CPU | 25% |
| Disk | 512 MB |
| Allocation/port | Tidak diperlukan |

Di tab **Startup**, isi perintah start dengan:

```text
npm start
```

Jangan memakai `npm install && npm start` sebagai startup command. Image resmi Pterodactyl menjalankan command tanpa shell, sehingga operator `&&` tidak diproses. Instalasi dependensi dilakukan satu kali lewat Console pada langkah 4.

Jika admin mengatur Docker image secara manual, image yang kompatibel adalah `ghcr.io/ptero-eggs/yolks:nodejs_22` atau versi Node yang lebih baru.

## 2. Upload kode bot

Jangan upload `.env` dari komputer. Token dibuat langsung di panel pada langkah berikutnya.

Pilihan paling mudah:

1. Dari folder proyek di komputer, buat arsip berisi `package.json` dan folder `src`:

   ```powershell
   Compress-Archive -Path package.json,src -DestinationPath bot-discord.zip
   ```

2. Buka Pterodactyl → **Files**, upload `bot-discord.zip`, lalu pilih **Unarchive** / **Extract**.
3. Pastikan hasil akhirnya memiliki `package.json` dan folder `src` langsung di root server (`/home/container`), bukan di dalam folder tambahan.

Jika panel menyediakan SFTP, upload kedua item tersebut langsung ke `/home/container` juga boleh.

## 3. Simpan konfigurasi rahasia

Di Pterodactyl → **Files**, buat file baru bernama `.env` di root server, lalu isi:

```dotenv
DISCORD_TOKEN=tempel_token_bot_di_sini
DISCORD_GUILD_ID=id_server_discord_kamu
```

Gunakan token dari Discord Developer Portal dan Server ID dari server Discord target. Jangan kirim token ke chat, jangan upload `.env` ke Git, dan jangan membagikan akses panel.

Jika admin panel dapat menambahkan environment variable yang bersifat rahasia, itu lebih baik: buat `DISCORD_TOKEN` dan `DISCORD_GUILD_ID` sebagai variable server. Bot otomatis membaca environment variable tersebut; file `.env` tidak diperlukan.

## 4. Instal dan jalankan

Di tab **Console**, jalankan satu per satu:

```bash
node --version
npm install
npm test
```

Versi Node harus `v22.12.0` atau lebih baru. Setelah test lulus, tekan **Start**. Log sukses akan berisi:

```text
Login sebagai nama-bot#xxxx
Slash command /afk dan /keluar siap dipakai.
```

Setelah dependensi terpasang, restart berikutnya cukup menekan **Start**; tidak perlu `npm install` lagi kecuali `package.json` berubah.

## 5. Uji di Discord

1. Pastikan bot sudah diundang dengan scopes `bot` dan `applications.commands`.
2. Role bot harus punya izin **View Channel** dan **Connect** di voice channel tujuan.
3. Masuk ke voice channel dengan akunmu.
4. Jalankan `/afk`; bot akan masuk ke channel yang sama.
5. Jalankan `/keluar` untuk memutuskan bot.

## Troubleshooting

| Gejala | Perbaikan |
| --- | --- |
| `node: command not found` atau versi di bawah 22.12 | Minta admin mengganti egg/image ke Node.js 22 atau lebih baru. |
| `npm ERR! enoent` | Pastikan `package.json` ada langsung di root server. |
| `Variabel .env belum diisi` | Buat/perbaiki `.env` atau environment variable di panel, lalu restart. |
| `TokenInvalid` | Reset/copy ulang token di Developer Portal; jangan sisakan spasi atau tanda kutip. |
| `/afk` tidak muncul | Cek `DISCORD_GUILD_ID`, scopes undangan, lalu restart bot untuk mendaftarkan ulang command. |
| Bot gagal masuk voice | Tambahkan **View Channel** dan **Connect** untuk role bot, termasuk permission overwrite channel privat. |

## Update bot

Stop server, upload file yang berubah, lalu jalankan `npm install` hanya bila `package.json` ikut berubah. Jalankan `npm test`, kemudian Start kembali.
