const axios = require('axios');

module.exports = {
  name: 'analyze',
  alias: ['describe'],
  category: 'ai',
  desc: 'Analyze an image and describe it using AI',
  async exec(sock, m, args, prefix) {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!mime.startsWith('image/')) return m.reply(`🖼️ Please reply to an image with ${prefix}analyze`);

    const media = await sock.downloadAndSaveMediaMessage(quoted);
    const fs = require('fs');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(media));

    try {
      m.reply('🔎 Analyzing image...');
      const res = await axios.post('https://photoai.peacetech.repl.co/caption', form, {
        headers: form.getHeaders()
      });
      const caption = res.data?.caption || "⚠️ Couldn't understand the image.";
      await sock.sendMessage(m.chat, { text: `🧠 *Caption:* ${caption}` }, { quoted: m });
      fs.unlinkSync(media);
    } catch (e) {
      console.error(e);
      m.reply("⚠️ Failed to analyze image.");
    }
  }
};
