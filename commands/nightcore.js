module.exports = {
  name: 'nightcore',
  alias: [],
  category: 'audio',
  desc: 'Applies nightcore effect',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!/audio|video/.test(mime)) return m.reply(`🎵 Please reply to an audio/video with ${prefix}nightcore`);

    const mediaPath = await sock.downloadAndSaveMediaMessage(quoted);
    const outputPath = `nightcore_${Date.now()}.mp3`;

    m.reply("🎶 Creating Nightcore version...");

    require('child_process').exec(
      `ffmpeg -i ${mediaPath} -filter:a "asetrate=44100*1.25,atempo=1.1" ${outputPath}`,
      async (err) => {
        if (err) return m.reply("❌ Error creating nightcore.");
        await sock.sendMessage(m.chat, { audio: { url: outputPath }, mimetype: 'audio/mpeg' }, { quoted: m });
        fs.unlinkSync(mediaPath);
        fs.unlinkSync(outputPath);
      }
    );
  }
};
