const axios = require('axios');

module.exports = {
  name: 'logo',
  alias: ['textlogo'],
  category: 'search',
  desc: 'Generate text logo',
  async exec(sock, m, args, prefix) {
    if (!args.length) return m.reply(`✏️ Usage: ${prefix}logo YourName`);
    const text = args.join(' ');
    m.reply('🎨 Generating logo...');

    try {
      const res = await axios.get(`https://api.textpro.me/create?template=flaming&text=${encodeURIComponent(text)}`);
      const imageUrl = res.data.url;
      await sock.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✨ Logo for *${text}*` }, { quoted: m });
    } catch (e) {
      console.error(e);
      m.reply('❌ Failed to generate logo.');
    }
  }
};
