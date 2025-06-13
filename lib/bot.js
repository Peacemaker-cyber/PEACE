const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const chalk = require('chalk');

const dbPath = path.join(__dirname, '../database/config.json');

// Ensure database exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    mode: "public",
    prefix: ".",
    sudo: ["254752818245"]
  }, null, 2));
}

let config = require(dbPath);

const isSudo = (jid) => {
  return config.sudo.includes(jid.replace(/[^0-9]/g, ''));
};

function startBot(sock, events, prefix, ownerNumber, ownerName) {
  events.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message || msg.key?.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

      const currentPrefix = config.prefix;
      const isCmd = body.startsWith(currentPrefix);
      const command = isCmd ? body.slice(currentPrefix.length).trim().split(" ")[0].toLowerCase() : "";
      const args = body.trim().split(/ +/).slice(1);

      // Mode handling
      if (config.mode === "private" && sender !== ownerNumber + "@s.whatsapp.net") {
        if (!isSudo(sender)) return;
      }

      // Logging
      console.log(chalk.blue(`[${moment().format('HH:mm:ss')}] ${command} from ${sender}`));

      // Commands
      switch (command) {
        case 'ping':
          await sock.sendMessage(from, { text: `🏓 Pong!` }, { quoted: msg });
          break;

        case 'setprefix':
          if (!isSudo(sender)) return sock.sendMessage(from, { text: "❌ Not authorized." }, { quoted: msg });
          if (!args[0]) return sock.sendMessage(from, { text: "✏️ Please provide a new prefix." }, { quoted: msg });
          config.prefix = args[0];
          fs.writeFileSync(dbPath, JSON.stringify(config, null, 2));
          await sock.sendMessage(from, { text: `✅ Prefix updated to \`${args[0]}\`` }, { quoted: msg });
          break;

        case 'mode':
          if (!isSudo(sender)) return;
          const mode = args[0];
          if (mode === 'public' || mode === 'private') {
            config.mode = mode;
            fs.writeFileSync(dbPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(from, { text: `🔁 Mode switched to *${mode}*` }, { quoted: msg });
          } else {
            await sock.sendMessage(from, { text: `Usage: ${currentPrefix}mode public/private` }, { quoted: msg });
          }
          break;

        case 'menu':
          const text = `
╭──❍ *ᴘᴇᴀᴄᴇ ᴍᴅ ᴍᴇɴᴜ*
│  👑 Owner: ${ownerName}
│  💬 Prefix: ${currentPrefix}
│  🔰 Mode: ${config.mode}
│  📆 Date: ${moment().tz('Africa/Nairobi').format('DD/MM/YYYY')}
│  🕒 Time: ${moment().tz('Africa/Nairobi').format('HH:mm:ss')}
│
├───❍ *COMMAND CATEGORIES*
│
│  📁 Download
│  🔎 Search
│  🧠 AI / GPT / DALL·E
│  🎧 Audio Tools
│  🖼️ Logo & Text
│  ⚙️ Settings
│  🏷️ Group Tools
│  🎲 Random Stuff
│  📷 Wallpaper
│  🔄 Converter
│  📌 Owner & Info
╰───────────────
`;
          await sock.sendMessage(from, { image: { url: 'https://files.catbox.moe/n0dgjr.jpg' }, caption: text }, { quoted: msg });
          break;

        default:
          // Ignore unknown commands silently
          break;
      }

    } catch (e) {
      console.error("Error in bot.js:", e);
    }
  });
}

module.exports = { startBot };
