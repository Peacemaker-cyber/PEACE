const { enableAntiDelete, disableAntiDelete, isAntiDeleteOn } = require('../lib/antiDelete');

module.exports = {
  name: 'antidelete',
  desc: 'Enable/disable anti-delete messages feature',
  category: 'settings',
  async exec(sock, m, args) {
    if (!m.isCreator) return m.reply('❌ Only the bot owner can use this command.');

    const option = args[0]?.toLowerCase();
    if (!option || !['chat', 'private', 'off'].includes(option)) {
      return m.reply('⚙️ Usage: .antidelete [chat | private | off]');
    }

    if (option === 'off') {
      disableAntiDelete(m.chat);
      return m.reply('🛑 Anti-delete disabled.');
    }

    enableAntiDelete(m.chat);
    await sock.sendMessage(m.chat, {
      text: option === 'private' ? 
        '🕵️ Anti-delete is ON. Deleted messages will be sent to your DM.' : 
        '📢 Anti-delete is ON. Deleted messages will be shown in the group.',
    });
  }
};
