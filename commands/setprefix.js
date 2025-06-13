const fs = require('fs');
const configPath = './config.js';

module.exports = {
  name: 'setprefix',
  desc: 'Change bot prefix',
  category: 'owner',
  async exec(sock, m, args) {
    if (!m.isCreator) return m.reply("❌ Owner only.");
    if (!args[0]) return m.reply("🆕 Provide a new prefix.");

    const config = require('../config');
    config.PREFIX = args[0];
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);

    m.reply(`✅ Prefix changed to \`${args[0]}\``);
  }
};
