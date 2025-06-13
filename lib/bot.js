const { loadCommands, handleCommand } = require('./command-handler');
const chalk = require('chalk');
const moment = require('moment-timezone');

const startBot = async (sock, ev, prefix, ownerNumber, ownerName) => {
  // ✅ Load all commands from /commands
  loadCommands();

  // 📥 Listen to incoming messages
  ev.on('messages.upsert', async (msg) => {
    try {
      const m = msg.messages[0];
      if (!m || !m.message || m.key?.fromMe) return;

      const from = m.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const pushName = m.pushName || 'Unknown';
      const sender = m.key.participant || m.key.remoteJid;

      const body = m.message?.conversation ||
                   m.message?.extendedTextMessage?.text ||
                   m.message?.imageMessage?.caption ||
                   m.message?.videoMessage?.caption ||
                   '';

      const commandLog = body.startsWith(prefix) ? body.slice(0, 40).split('\n')[0] : '';
      if (commandLog) {
        console.log(chalk.green(`[💬 CMD] ${commandLog} — from ${pushName} ${isGroup ? '[GROUP]' : '[PRIVATE]'}`));
      }

      // 👇 Handle the actual command
      await handleCommand(sock, m, prefix, ownerNumber, ownerName);

    } catch (err) {
      console.error(chalk.red('[❌ BOT ERROR]'), err);
    }
  });

  // 🟢 Auto Connection Success Message
  const time = moment().tz('Africa/Nairobi').format('HH:mm:ss');
  const date = moment().tz('Africa/Nairobi').format('DD/MM/YYYY');
  const connMsg = `
╭───[ 🤖 𝐏𝐄𝐀𝐂𝐄 𝐌𝐃 𝐁𝐎𝐓 𝐎𝐍 ]
│
│🕒 Time   : ${time}
│📅 Date   : ${date}
│🔖 Prefix : ${prefix}
│👑 Owner  : 𝙋𝙀𝘼𝘾𝙀𝙈𝘼𝙆𝙀𝙍💚
│📞 Sudo   : ${ownerNumber}
╰───────────────────⭓
`;

  console.log(chalk.cyan(connMsg));
};

module.exports = { startBot };
