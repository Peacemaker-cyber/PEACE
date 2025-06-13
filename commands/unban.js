const fs = require('fs');
const banDB = './lib/banlist.json';

module.exports = {
  name: 'unban',
  desc: 'Unban user',
  category: 'owner',
  async exec(sock, m) {
    if (!m.isCreator) return m.reply("❌ Owner only.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention user to unban.");

    let db = JSON.parse(fs.readFileSync(banDB));
    m.mentionedJid.forEach(jid => delete db[jid]);

    fs.writeFileSync(banDB, JSON.stringify(db, null, 2));
    m.reply("✅ User(s) unbanned.");
  }
};
