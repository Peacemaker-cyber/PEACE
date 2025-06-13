module.exports = {
  name: 'block',
  desc: 'Block a user',
  category: 'owner',
  async exec(sock, m) {
    if (!m.isCreator) return m.reply("❌ Owner only.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention user to block.");

    for (let jid of m.mentionedJid) {
      await sock.updateBlockStatus(jid, 'block');
    }

    m.reply("✅ User(s) blocked.");
  }
};
