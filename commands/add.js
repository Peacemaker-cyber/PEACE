module.exports = {
  name: 'add',
  desc: 'Add member to group',
  category: 'group',
  async exec(sock, m, args) {
    if (!m.isGroup) return m.reply("❗ Group only.");
    if (!m.isAdmin) return m.reply("❌ Only admins can add.");
    const user = args[0]?.replace(/[^0-9]/g, '');
    if (!user) return m.reply("🔢 Provide a valid number.");

    await sock.groupParticipantsUpdate(m.chat, [`${user}@s.whatsapp.net`], 'add');
    m.reply("✅ User added.");
  }
};
