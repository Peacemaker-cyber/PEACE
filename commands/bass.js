const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'bass',
  alias: [],
  category: 'audio',
  desc: 'Applies bass boost to audio',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!/audio|video/.test(mime)) return m.reply(`🎵 Please reply to an audio/video with ${prefix}bass`);

    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outputPath = `bass_${Date.now()}.mp3`;

    m.reply("🎧 Applying bass effect...");

    exec(`ffmpeg -i ${mediaPath} -af "bass=g=10,dynaudnorm=f=200" ${outputPath}`, async (err) => {
      if (err) return m.reply("❌ Error applying effect.");
      await sock.sendMessage(m.chat, { audio: { url: outputPath }, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(mediaPath);
      fs.unlinkSync(outputPath);
    });
  }
};
