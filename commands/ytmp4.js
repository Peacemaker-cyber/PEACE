const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
  name: 'ytmp4',
  desc: 'Download video from YouTube',
  category: 'download',
  async exec(sock, m, args) {
    if (!args[0]?.includes('youtu')) return m.reply('📌 Send a valid YouTube URL.');

    const url = args[0];
    const id = Date.now();
    const tmp = `yt_${id}.mp4`;
    const out = `yt_${id}_wm.mp4`;

    m.reply('🎥 Downloading video...');
    ytdl(url, { quality: 'highestvideo' }).pipe(fs.createWriteStream(tmp))
      .on('finish', () => {
        exec(`ffmpeg -i ${tmp} -vf "drawtext=text='powered by ᴘᴇᴀᴄᴇ ᴍᴅ':fontcolor=white@0.8:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=10:y=H-th-10" -c:a copy ${out}`, async (err) => {
          fs.unlinkSync(tmp);
          if (err) return m.reply('⚠️ FFmpeg watermark error.');
          await sock.sendMessage(m.chat, { video: { url: out }, caption: '🎬 Here’s your video' }, { quoted: m });
          fs.unlinkSync(out);
        });
      });
  }
};
