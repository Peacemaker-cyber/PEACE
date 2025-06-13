// 📁 File: bot.js const { Boom } = require('@hapi/boom'); const makeWASocket = require('@whiskeysockets/baileys').default; const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys'); const Pino = require('pino'); const path = require('path'); const fs = require('fs'); const moment = require('moment-timezone');

const { serialize } = require('./lib/serialize'); const { color } = require('./lib/color'); const { getAntiDeleteMode, isAntiDeleteOn } = require('./lib/antiDelete'); const { getTime, getDate } = require('./lib/functions'); const config = require('./config.json');

const connectToWhatsApp = async () => { const { state, saveCreds } = await useMultiFileAuthState('session'); const { version, isLatest } = await fetchLatestBaileysVersion(); const sock = makeWASocket({ logger: Pino({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ['PEACE MD', 'Chrome', '5.0'], version });

// Auto connection message sock.ev.on('connection.update', async (update) => { const { connection, lastDisconnect } = update;

if (connection === 'open') {
  const time = getTime();
  const date = getDate();
  const prefix = config.prefix;
  const sudo = config.sudo.join(', ');

  const msg = `🟢 *ʙᴏᴛ ᴄᴏɴɴᴇᴄᴛᴇᴅ!*

👑 Bot: ᴘᴇᴀᴄᴇ ᴍᴅ 👤 Owner: ᴘᴇᴀᴄᴇᴍᴀᴋᴇʀ💚 ⏰ Time: ${time} 📆 Date: ${date} 📍 Prefix: ${prefix} 🔢 Sudo(s): ${sudo}`;

await sock.sendMessage(config.sudo[0] + '@s.whatsapp.net', { text: msg });
}

if (connection === 'close') {
  const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
  if (shouldReconnect) connectToWhatsApp();
}

});

sock.ev.on('creds.update', saveCreds);

// Listen for deleted messages (anti-delete) sock.ev.on('messages.delete', async ({ messages }) => { const msg = messages[0]; const from = msg.key.remoteJid; const mode = getAntiDeleteMode(from);

if (!isAntiDeleteOn(from)) return;
if (!msg.message) return;

let caption = `🚫 *Anti Delete*

📅 ${getDate()} ⏰ ${getTime()} 👤 ${msg.pushName || 'User'}

`;

try {
  await sock.sendMessage(
    mode === 'private' ? config.sudo[0] + '@s.whatsapp.net' : from,
    { text: caption }
  );
  await sock.sendMessage(
    mode === 'private' ? config.sudo[0] + '@s.whatsapp.net' : from,
    { forward: msg }
  );
} catch (err) {
  console.error('AntiDelete error:', err);
}

});

// Listen for messages sock.ev.on('messages.upsert', async ({ messages, type }) => { if (type !== 'notify') return; let m = serialize(sock, messages[0]); if (!m.message || m.key && m.key.remoteJid === 'status@broadcast') return;

try {
  const commandPath = path.join(__dirname, 'commands');
  const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(commandPath, file));
    if (m.body.startsWith(config.prefix + command.name)) {
      return command.exec(sock, m, m.body.trim().split(' ').slice(1));
    }
  }
} catch (err) {
  console.error('Message handler error:', err);
}

}); };

connectToWhatsApp();

