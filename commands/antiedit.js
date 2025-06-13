const { setAntiEditMode } = require('../lib/antiEdit');

module.exports = {
  name: 'antiedit',
  desc: 'Toggle anti-edit messages (private/group)',
  category: 'settings',
  async exec(sock, m, args) {
    if (!m.isAdmin) return m.reply('❌ Admin only.');

    const mode = args[0]?.toLowerCase();
    if (!mode || !['private', 'chat', 'off'].includes(mode)) {
      return m.reply('💡 Usage: .antiedit private | chat | off');
    }

    const jid = m.chat;
    if (mode === 'off') {
      require('fs').readFileSync('./lib/antiEdit.json', 'utf-8', (err, data) => {
        if (!err) {
          const db = JSON.parse(data);
          delete db[jid];
          require('fs').writeFileSync('./lib/antiEdit.json', JSON.stringify(db, null, 2));
        }
      });
      return m.reply('🚫 Anti-Edit disabled.');
    }

    setAntiEditMode(jid, mode);
    m.reply(`✅ Anti-Edit enabled in *${mode}* mode.`);
  }
};
