const os = require('os');
const moment = require('moment-timezone');

module.exports = {
  name: "ping",
  alias: ["alive", "status"],
  desc: "Check bot status",
  type: "info",
  exec: async (sock, m, args, prefix, command, ownerName) => {
    const timestamp = moment().tz("Africa/Nairobi").format("HH:mm:ss");
    const date = moment().tz("Africa/Nairobi").format("DD-MM-YYYY");
    const uptime = process.uptime();
    const formatTime = (seconds) => {
      const pad = (s) => (s < 10 ? '0' : '') + s;
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
    };

    const caption = `
╭──❍ *ᴘᴇᴀᴄᴇ ᴍᴅ ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ*
│
│ 🟢 𝗢𝗡𝗟𝗜𝗡𝗘: Yes
│ ⏱ 𝗨𝗽𝘁𝗶𝗺𝗲 : ${formatTime(uptime)}
│ 📆 𝗗𝗮𝘁𝗲   : ${date}
│ 🕐 𝗧𝗶𝗺𝗲   : ${timestamp}
│ 👑 𝗢𝘄𝗻𝗲𝗿 : ${ownerName}
│ 🔰 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}
╰───────────────
`;

    await sock.sendMessage(m.chat, {
      image: { url: 'https://i.ibb.co/bHPsWZX/status.png' },
      caption,
    }, { quoted: m });
  }
};
