const axios = require('axios');

module.exports = {
  name: 'pinterest',
  alias: ['pin'],
  category: 'search',
  desc: 'Search Pinterest images',
  async exec(sock, m, args, prefix) {
    if (!args.length) return m.reply(`📌 Usage: ${prefix}pinterest sunset`);
    const query = args.join(' ');
    m.reply('🔍 Fetching from Pinterest...');

    try {
      const res = await axios.get(`https://api.lemonsqueezy.com/api/v1/pinterest?query=${encodeURIComponent(query)}`);
      const pins = res.data.data;
      if (!pins.length) return m.reply('❌ No pins found.');

      const img = pins[Math.floor(Math.random() * pins.length)].images['original']['url'];
      await sock.sendMessage(m.chat, { image: { url: img }, caption: `🌸 Pinterest: *${query}*` }, { quoted: m });
    } catch (e) {
      console.error(e);
      m.reply('❌ Failed to fetch Pinterest images.');
    }
  }
};
