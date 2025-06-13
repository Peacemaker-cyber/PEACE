const fs = require('fs');
const banDB = './lib/banlist.json';

module.exports = {
  name: 'ban',
  desc: 'Ban user from using the bot',
  category: 'owner',
  async exec(sock, m) {
    if (!m.isCreator) return m.reply("❌ Owner only.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention user to ban.");

    let db = JSON.parse(fs.readFileSync(banDB));
    m.mentionedJid.forEach(jid => db[jid] = true);

    fs.writeFileSync(banDB, JSON.stringify(db, null, 2));
    m.reply("🚫 User(s) banned.");
  }
};
