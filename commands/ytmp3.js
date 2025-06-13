const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
  name: 'ytmp3',
  desc: 'Download audio from YouTube',
  category: 'download',
  async exec(sock, m, args) {
    if (!args[0]?.includes('youtu')) return m.reply('📌 Send a valid YouTube URL.');

    const url = args[0];
    const id = Date.now();
    const tmp = `yt_${id}.mp4`;
    const out = `yt_${id}.mp3`;
    
    m.reply('🔄 Downloading audio...');
    ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
      .pipe(fs.createWriteStream(tmp))
      .on('finish', () => {
        exec(`ffmpeg -i ${tmp} -af "volume=1" -metadata title="powered by ᴘᴇᴀᴄᴇ ᴍᴅ" ${out}`, async (err) => {
          fs.unlinkSync(tmp);
          if (err) return m.reply('⚠️ FFmpeg error.');
          await sock.sendMessage(m.chat, { audio: { url: out }, mimetype: 'audio/mpeg' }, { quoted: m });
          fs.unlinkSync(out);
        });
      });
  }
};
