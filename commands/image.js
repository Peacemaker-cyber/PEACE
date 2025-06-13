const axios = require('axios');

module.exports = {
  name: 'image',
  alias: ['img', 'searchimg'],
  category: 'search',
  desc: 'Search for an image',
  async exec(sock, m, args, prefix) {
    if (!args.length) return m.reply(`🔍 Usage: ${prefix}image cats`);
    const query = args.join(' ');
    m.reply('🔎 Searching image...');

    try {
      const res = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
      const img = res.data.urls.regular;
      await sock.sendMessage(m.chat, { image: { url: img }, caption: `🖼️ Image search: *${query}*` }, { quoted: m });
    } catch (e) {
      console.error(e);
      m.reply('❌ Failed to fetch image.');
    }
  }
};
