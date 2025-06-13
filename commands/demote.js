module.exports = {
  name: 'demote',
  desc: 'Demote admin to member',
  category: 'group',
  async exec(sock, m) {
    if (!m.isGroup || !m.isAdmin) return m.reply("❌ Admin only.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention who to demote.");

    await sock.groupParticipantsUpdate(m.chat, m.mentionedJid, 'demote');
    m.reply("⬇️ Demoted to member.");
  }
};
