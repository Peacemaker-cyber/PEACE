// 📁 File: bot.js const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys'); const { Boom } = require('@hapi/boom'); const fs = require('fs'); const path = require('path'); const P = require('pino'); const chalk = require('chalk'); const moment = require('moment-timezone'); const { serialize } = require('./lib/serialize'); const { smsg } = require('./lib/simple'); const { isAntiDeleteOn, getAntiDeleteMode } = require('./lib/antiDelete'); const { isAntiEditOn, getAntiEditMode } = require('./lib/antiEdit');

const prefix = '.'; const owner = ['254752818245']; const botName = 'ᴘᴇᴀᴄᴇ ᴍᴅ';

async function startBot() { const { state, saveCreds } = await useMultiFileAuthState('PEACE~session'); const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({ version, logger: P({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ['PEACE MD', 'Safari', '1.0.0'], generateHighQualityLinkPreview: true });

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', ({ connection, lastDisconnect }) => { if (connection === 'close') { const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startBot(); } else if (connection === 'open') { const time = moment().tz('Africa/Nairobi').format('HH:mm:ss'); const date = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY'); const message = ╭─❏ *Connected to ${botName}* ├ Time: ${time} ├ Date: ${date} ├ Prefix: ${prefix} ├ Owner: 𝙋𝙀𝘼𝘾𝙀𝙈𝘼𝙆𝙀𝙍💚 ╰─❏ Sudo: ${owner.join(', ')}; console.log(chalk.greenBright(message)); } });

const commands = new Map(); const commandPath = path.join(__dirname, 'commands'); fs.readdirSync(commandPath).forEach(file => { if (file.endsWith('.js')) { const command = require(path.join(commandPath, file)); commands.set(command.name, command); } });

sock.ev.on('messages.upsert', async ({ messages }) => { const m = await serialize(JSON.parse(JSON.stringify(messages[0])), sock); if (!m.message) return;

m.prefix = prefix;
m.body = m.body || '';
m.isCmd = m.body.startsWith(prefix);
m.command = m.isCmd ? m.body.slice(1).split(' ')[0].toLowerCase() : '';
m.args = m.isCmd ? m.body.slice(m.command.length + 2).trim().split(/ +/) : [];

m.isGroup = m.chat.endsWith('@g.us');
m.sender = m.isGroup ? m.participant : m.key.remoteJid;
m.isOwner = owner.includes(m.sender.split('@')[0]);
m.isAdmin = m.isGroup ? (m.metadata.admins || []).includes(m.sender) : false;
m.isCreator = m.isOwner;

try {
  const command = commands.get(m.command);
  if (command) await command.exec(sock, m, m.args);
} catch (e) {
  console.error(e);
}

});

sock.ev.on('messages.update', async updates => { for (const update of updates) { if (!update.update.message) continue; const jid = update.key.remoteJid; if (isAntiEditOn(jid)) { const mode = getAntiEditMode(jid); const msg = await sock.loadMessage(jid, update.key.id); if (msg && msg.message) { const original = smsg({ ...msg }); const editedText = smsg({ ...update.update }); const time = moment().tz('Africa/Nairobi').format('HH:mm:ss');

const text = `✍️ *Edited Message Detected!*

From: @${update.key.participant?.split('@')[0]} Time: ${time}

Old: ${original.body} New: ${editedText.body}`;

const target = mode === 'private' ? owner[0] + '@s.whatsapp.net' : jid;
      await sock.sendMessage(target, {
        text,
        mentions: [update.key.participant]
      });
    }
  }
}

}); }

startBot();

