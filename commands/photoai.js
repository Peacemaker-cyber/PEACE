const axios = require('axios');

module.exports = {
  name: 'photoai',
  alias: ['faceai'],
  category: 'ai',
  desc: 'Enhance a photo using AI',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!mime.startsWith('image/')) return m.reply(`📷 Please reply to an image with ${prefix}photoai`);

    const media = await sock.downloadAndSaveMediaMessage(quoted);
    const fs = require('fs');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(media));

    try {
      m.reply('✨ Enhancing...');
      const res = await axios.post('https://photoai.peacetech.repl.co/enhance', form, {
        headers: form.getHeaders()
      });
      const image = res.data?.image;
      if (!image) return m.reply("❌ Failed to process the image.");
      await sock.sendMessage(m.chat, { image: { url: image }, caption: '🧠 Enhanced by AI' }, { quoted: m });
      fs.unlinkSync(media);
    } catch (e) {
      console.error(e);
      m.reply("⚠️ Error processing image.");
    }
  }
};
