const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
  name: 'instagram',
  alias: ['ig', 'insta'],
  desc: 'Download Instagram video/photo',
  category: 'download',
  async exec(sock, m, args) {
    if (!args[0]?.includes('instagram.com')) return m.reply('📌 Send a valid Instagram URL.');

    const url = args[0];
    const id = Date.now();
    const tmp = `ig_${id}.mp4`;
    const out = `ig_${id}_wm.mp4`;

    m.reply('🔄 Fetching Instagram media...');
    try {
      const res = await axios.get(`https://api.somedownloadservice.com/ig?url=${encodeURIComponent(url)}`);
      const link = res.data.link;
      const writer = fs.createWriteStream(tmp);
      const resp = await axios({ url: link, method: 'GET', responseType: 'stream' });
      resp.data.pipe(writer);
      writer.on('finish', () => {
        exec(`ffmpeg -i ${tmp} -vf "drawtext=text='powered by ᴘᴇᴀᴄᴇ ᴍᴅ':fontcolor=white@0.8:fontsize=20:box=1:boxcolor=black@0.5:x=10:y=H-th-10" -c:a copy ${out}`, async (err) => {
          fs.unlinkSync(tmp);
          if (err) return m.reply('⚠️ FFmpeg watermark error.');
          await sock.sendMessage(m.chat, { video: { url: out }, caption: '🎬 Instagram downloaded' }, { quoted: m });
          fs.unlinkSync(out);
        });
      });
    } catch {
      m.reply('❌ Failed to download Instagram media.');
    }
  }
};
