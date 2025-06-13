module.exports = {
  name: 'deep',
  alias: [],
  category: 'audio',
  desc: 'Makes audio deeper',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!/audio|video/.test(mime)) return m.reply(`🎵 Please reply to an audio/video with ${prefix}deep`);

    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outputPath = `deep_${Date.now()}.mp3`;

    m.reply("🌀 Making audio deeper...");

    require('child_process').exec(
      `ffmpeg -i ${mediaPath} -af "asetrate=44100*0.8,aresample=44100,atempo=1.1" ${outputPath}`,
      async (err) => {
        if (err) return m.reply("❌ Error processing audio.");
        await sock.sendMessage(m.chat, { audio: { url: outputPath }, mimetype: 'audio/mpeg' }, { quoted: m });
        fs.unlinkSync(mediaPath);
        fs.unlinkSync(outputPath);
      }
    );
  }
};
