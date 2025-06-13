module.exports = {
  name: 'kick',
  desc: 'Remove member from group',
  category: 'group',
  async exec(sock, m, args) {
    if (!m.isGroup) return m.reply("❗ Group only.");
    if (!m.isAdmin) return m.reply("❌ Only admins can kick.");
    if (!m.mentionedJid?.length) return m.reply("👤 Mention who to kick.");

    await sock.groupParticipantsUpdate(m.chat, m.mentionedJid, 'remove');
    m.reply("✅ User kicked.");
  }
};
