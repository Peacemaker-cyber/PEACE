// ✅ PEACE MD - Full Updated bot.js with AntiViewOnce, AntiDelete, AntiEdit, AntiCall

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, jidDecode } = require('@whiskeysockets/baileys'); const P = require('pino'); const fs = require('fs'); const path = require('path'); const chalk = require('chalk'); const moment = require('moment-timezone'); const config = require('./config.json'); const { serialize } = require('./lib/serialize'); const { smsg, getBuffer } = require('./lib/functions');

const welcomeDB = JSON.parse(fs.readFileSync('./lib/welcome.json', 'utf-8')); const antiDeleteDB = JSON.parse(fs.readFileSync('./lib/antidelete.json', 'utf-8')); const antiEditDB = JSON.parse(fs.readFileSync('./lib/antiedit.json', 'utf-8')); const antiViewDB = JSON.parse(fs.readFileSync('./lib/antiviewonce.json', 'utf-8'));

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

async function startBot() { const { state, saveCreds } = await useMultiFileAuthState('session'); const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({ version, printQRInTerminal: true, auth: state, logger: P({ level: 'silent' }), browser: ['PEACE~MD', 'Safari', '1.0.0'] });

store.bind(sock.ev);

// 🎉 Auto Connection Message sock.ev.on('connection.update', async ({ connection }) => { if (connection === 'open') { const time = moment().tz('Africa/Nairobi').format('HH:mm:ss'); const date = moment().tz('Africa/Nairobi').format('DD/MM/YYYY'); const msg =  ╭━〔 *Connected Successfully* 〕━⬣ ┃⌚ *Time:* ${time} ┃📅 *Date:* ${date} ┃🔖 *Prefix:* ${config.prefix} ┃👑 *Owner:* 𝙋𝙀𝘼𝘾𝙀𝙈𝘼𝙆𝙀𝙍💚 ┃🧑‍💻 *Sudo:* ${config.sudo.join(', ')} ╰━━━━━━━━━━━━━━⬣

await sock.sendMessage(config.sudo[0] + '@s.whatsapp.net', { text: msg });
  console.log(chalk.green('[ PEACE~MD ] Bot connected successfully.'));
}

});

// ☎️ Anti-Call sock.ev.on('call', async (json) => { for (let node of json) { if (node.status === 'offer') { const callerId = node.from; await sock.sendMessage(callerId, { text: `🚫 Auto-blocked call detected!

❌ Do not call the bot number! 💡 Contact the owner instead: wa.me/${config.owner}` }); await sock.updateBlockStatus(callerId, 'block'); console.log(chalk.red('🚫 Call blocked from:'), callerId); } } });

// 📩 Message Events sock.ev.on('messages.upsert', async ({ messages }) => { let m = messages[0]; if (!m.message || m.key?.remoteJid === 'status@broadcast') return; m = await serialize(sock, m);

try {
  const body = m.body || '';
  const isCmd = body.startsWith(config.prefix);
  const cmdName = isCmd ? body.slice(config.prefix.length).split(/\s+/)[0].toLowerCase() : null;
  const args = isCmd ? body.trim().split(/\s+/).slice(1) : [];

  m.isGroup = m.chat.endsWith('@g.us');
  m.isAdmin = m.isGroup ? (m.metadata?.participants?.find(p => p.id === m.sender)?.admin || '').includes('admin') : false;
  m.isCreator = config.sudo.includes(m.sender.split('@')[0]);

  // 🗑️ Anti-Delete
  sock.ev.on('messages.delete', async ({ keys }) => {
    for (const key of keys) {
      if (antiDeleteDB[key.remoteJid]) {
        const msg = store.loadMessage(key.remoteJid, key.id);
        if (msg) {
          await sock.sendMessage(key.remoteJid, { forward: msg.message }, { quoted: msg });
        }
      }
    }
  });

  // ✏️ Anti-Edit
  if (m.messageStubType === 1 && antiEditDB[m.chat]) {
    const original = store.loadMessage(m.chat, m.key.id);
    if (original) {
      await sock.sendMessage(antiEditDB[m.chat] === 'private' ? m.sender : m.chat, {
        text: `✏️ *Edited Message Detected:*

🧑 From: @${m.sender.split('@')[0]} 📍 In: ${m.isGroup ? m.metadata.subject : 'Private'} 💬 Message: ${original.message?.conversation || '(media)'}`, mentions: [m.sender] }); } }

// 🔁 Anti ViewOnce
  if (m.message?.viewOnceMessage && antiViewDB[m.chat]) {
    const msgType = Object.keys(m.message.viewOnceMessage.message)[0];
    const media = m.message.viewOnceMessage.message[msgType];

    let watermark = '🔁 *View-Once Disabled*\n`powered by 𝙋𝙀𝘼𝘾𝙀 𝙈𝘿 💚`';

    await sock.sendMessage(m.chat, {
      [msgType]: media,
      caption: (media.caption || '') + '\n\n' + watermark,
      mimetype: media.mimetype
    }, { quoted: m });
  }

  // 📥 Command Handling
  if (isCmd) {
    const commandPath = path.join(__dirname, 'commands', `${cmdName}.js`);
    if (fs.existsSync(commandPath)) {
      const command = require(commandPath);
      return command.exec(sock, m, args);
    }
  }
} catch (err) {
  console.error(chalk.red('❌ Error:'), err);
}

});

sock.ev.on('creds.update', saveCreds); }

startBot();

