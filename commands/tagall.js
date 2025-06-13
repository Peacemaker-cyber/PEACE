module.exports = {
  name: 'tagall',
  desc: 'Mention all group members',
  category: 'group',
  async exec(sock, m) {
    if (!m.isGroup || !m.isAdmin) return m.reply("❌ Admin only.");

    const participants = m.metadata.participants.map(p => p.id);
    const message = `🔔 Tag All:\n\n${participants.map((id, i) => `${i + 1}. @${id.split('@')[0]}`).join('\n')}`;
    await sock.sendMessage(m.chat, { text: message, mentions: participants }, { quoted: m });
  }
};
