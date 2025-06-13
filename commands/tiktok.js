const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
  name: 'tiktok',
  desc: 'Download TikTok clip',
  category: 'download',
  async exec(sock, m, args) {
    if (!args[0]?.includes('tiktok')) return m.reply('📌 Send a valid TikTok URL.');

    const url = args[0];
    const id = Date.now();
    const tmp = `tt_${id}.mp4`;
    const out = `tt_${id}_wm.mp4`;

    m.reply('🔄 Fetching TikTok video...');
    try {
      const res = await axios.get(`https://api.videosave.example/download?url=${encodeURIComponent(url)}`);
      const link = res.data.video;
      const writer = fs.createWriteStream(tmp);
      const resp = await axios({ url: link, method: 'GET', responseType: 'stream' });
      resp.data.pipe(writer);
      writer.on('finish', () => {
        exec(`ffmpeg -i ${tmp} -vf "drawtext=text='powered by ᴘᴇᴀᴄᴇ ᴍᴅ':fontcolor=white@0.8:fontsize=20:box=1:boxcolor=black@0.5:x=10:y=H-th-10" -c:a copy ${out}`, async (err) => {
          fs.unlinkSync(tmp);
          if (err) return m.reply('⚠️ FFmpeg watermark error.');
          await sock.sendMessage(m.chat, { video: { url: out }, caption: '🎬 TikTok downloaded' }, { quoted: m });
          fs.unlinkSync(out);
        });
      });
    } catch {
      m.reply('❌ Failed to download TikTok video.');
    }
  }
};
