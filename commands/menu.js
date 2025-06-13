module.exports = {
  name: 'menu',
  alias: ['help', 'commands'],
  category: 'info',
  desc: 'Displays the full bot command menu.',
  async exec(sock, m, args, prefix, command, ownerName, ownerNumber) {
    const menuText = `
╭──〔 🤖 *ᴘᴇᴀᴄᴇ ᴍᴅ ᴍᴇɴᴜ* 〕──
│👑 *Owner:* ${ownerName}
│🆔 *Prefix:* ${prefix}
│📅 *Date:* ${new Date().toLocaleDateString()}
│🕒 *Time:* ${new Date().toLocaleTimeString()}
╰─────────────⭓

╭─❏ *AI COMMANDS*
│${prefix}gpt
│${prefix}dalle
│${prefix}analyze
│${prefix}photoai
╰─────────────

╭─❏ *AUDIO COMMANDS*
│${prefix}bass
│${prefix}deep
│${prefix}tomp3
│${prefix}nightcore
╰─────────────

╭─❏ *DOWNLOAD COMMANDS*
│${prefix}ytmp3
│${prefix}ytmp4
│${prefix}tiktok
│${prefix}instagram
╰─────────────

╭─❏ *GROUP COMMANDS*
│${prefix}kick @user
│${prefix}add 254xxxxxx
│${prefix}promote @user
│${prefix}demote @user
╰─────────────

╭─❏ *SEARCH & LOGO*
│${prefix}image
│${prefix}pinterest
│${prefix}logo text
╰─────────────

╭─❏ *INFO/OWNER*
│${prefix}owner
│${prefix}ping
│${prefix}script
╰─────────────

🧠 *ᴘᴇᴀᴄᴇ ᴍᴅ* | Powered by *${ownerName}*
`;

    await sock.sendMessage(m.chat, { text: menuText }, { quoted: m });
  }
};
