const axios = require('axios');

module.exports = {
  name: 'dalle',
  alias: ['imagegen'],
  category: 'ai',
  desc: 'Generate images using AI (DALL·E-like)',
  async exec(sock, m, args, prefix) {
    if (!args.length) {
      return m.reply(`🧠 Usage: ${prefix}dalle futuristic city`);
    }

    const prompt = args.join(' ');
    try {
      m.reply('🎨 Generating image...');
      const res = await axios.get(`https://api.kenzieapi.xyz/dalle?q=${encodeURIComponent(prompt)}`);
      const img = res.data?.image;
      if (!img) return m.reply('❌ Failed to get image.');
      await sock.sendMessage(m.chat, { image: { url: img }, caption: `🎨 *Prompt:* ${prompt}` }, { quoted: m });
    } catch (err) {
      console.error(err);
      m.reply("❌ Error generating image.");
    }
  }
};
