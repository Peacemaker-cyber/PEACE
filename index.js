const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('@whiskeysockets/baileys');

const P = require('pino');
const figlet = require('figlet');
const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs-extra');
const path = require('path');

// 🕒 Timezone Setup
const time = moment().tz('Africa/Nairobi').format('HH:mm:ss');
const date = moment().tz('Africa/Nairobi').format('DD-MM-YYYY');
const prefix = ".";

// 👑 Owner Details
const OWNER_NAME = "𝙋𝙀𝘼𝘾𝙀𝙈𝘼𝙆𝙀𝙍💚";
const OWNER_NUMBER = "254752818245";

// 📦 Import Bot Logic
const { startBot } = require('./lib/bot');

// 🌟 Pretty Banner
console.clear();
console.log(chalk.green(figlet.textSync("PEACE MD", { horizontalLayout: "full" })));

// 🚀 Start WhatsApp Socket
const start = async () => {
  // Session with custom ID prefix
  const SESSION_ID = 'PEACE~default';
  const sessionPath = `./session/${SESSION_ID}`;

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ["ᴘᴇᴀᴄᴇ ᴍᴅ", "Chrome", "1.0.0"],
  });

  // 💬 Styled Connection Message
  const connectMsg = `
┏━━━━━━━━━━━━━━━━━━━┓
┃   ✅ ʙᴏᴛ ᴄᴏɴɴᴇᴄᴛᴇᴅ   
┗━━━━━━━━━━━━━━━━━━━┛
📛 𝗡𝗮𝗺𝗲 : 𝐏𝐄𝐀𝐂𝐄 𝐌𝐃 ʙᴏᴛ
👑 𝗢𝘄𝗻𝗲𝗿 : ${OWNER_NAME}
📟 𝗠𝗼𝗱𝗲 : Public / Private
🔣 𝗣𝗿𝗲𝗳𝗶𝘅 : \`${prefix}\`
🕐 𝗧𝗶𝗺𝗲 : ${time}
📆 𝗗𝗮𝘁𝗲 : ${date}
🔧 𝗦𝘂𝗱𝗼 : ${OWNER_NUMBER}
━━━━━━━━━━━━━━━━━━━━
`.trim();

  console.log(chalk.cyan(connectMsg));

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      await sock.sendMessage(`${OWNER_NUMBER}@s.whatsapp.net`, { text: connectMsg });
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red("Connection closed. Reconnecting..."), shouldReconnect);
      if (shouldReconnect) start();
    }
  });

  // Start command handler
  startBot(sock, sock.ev, prefix, OWNER_NUMBER, OWNER_NAME);

  // Save creds
  sock.ev.on('creds.update', saveCreds);
};

start();
