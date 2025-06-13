const fs = require('fs');
const welcomePath = './lib/welcome.json';

module.exports = {
  name: 'welcome',
  desc: 'Enable/disable welcome in group',
  category: 'group',
  async exec(sock, m, args) {
    if (!m.isGroup || !m.isAdmin) return m.reply("❌ Admin only.");
    if (!args[0]) return m.reply("💡 Use `.welcome on` or `.welcome off`");

    const db = JSON.parse(fs.readFileSync(welcomePath, 'utf-8'));
    const status = args[0].toLowerCase();

    if (status === 'on') {
      db[m.chat] = true;
      m.reply("✅ Welcome enabled.");
    } else if (status === 'off') {
      delete db[m.chat];
      m.reply("🚫 Welcome disabled.");
    } else {
      return m.reply("❗ Use on/off.");
    }

    fs.writeFileSync(welcomePath, JSON.stringify(db, null, 2));
  }
};
