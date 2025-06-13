const fs = require('fs');
const configPath = './config.js';

module.exports = {
  name: 'mode',
  desc: 'Switch bot mode',
  category: 'owner',
  async exec(sock, m, args) {
    if (!m.isCreator) return m.reply("❌ Owner only.");
    const input = args[0]?.toLowerCase();
    if (!input || !['public', 'private'].includes(input)) {
      return m.reply("💡 Usage: .mode public / .mode private");
    }

    const config = require('../config');
    config.MODE = input;
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);

    m.reply(`✅ Bot mode set to *${input.toUpperCase()}*`);
  }
};
