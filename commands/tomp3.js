module.exports = {
  name: 'tomp3',
  alias: ['mp3'],
  category: 'audio',
  desc: 'Converts audio/video to mp3',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!/audio|video/.test(mime)) return m.reply(`🎵 Please reply to an audio/video with ${prefix}tomp3`);

    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outputPath = `mp3_${Date.now()}.mp3`;

    m.reply("🎧 Converting to MP3...");

    require('child_process').exec(`ffmpeg -i ${mediaPath} ${outputPath}`, async (err) => {
      if (err) return m.reply("❌ Failed to convert.");
      await sock.sendMessage(m.chat, { audio: { url: outputPath }, mimetype: 'audio/mpeg' }, { quoted: m });
      require('fs').unlinkSync(mediaPath);
      require('fs').unlinkSync(outputPath);
    });
  }
};
