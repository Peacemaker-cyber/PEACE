module.exports = {
  name: 'promote',
  desc: 'Promote member to admin',
  category: 'group',
  async exec(sock, m) {
    if (!m.isGroup || !m.isAdmin) return m.reply("❌ Admin only.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention who to promote.");

    await sock.groupParticipantsUpdate(m.chat, m.mentionedJid, 'promote');
    m.reply("🎖 Promoted to admin.");
  }
};
