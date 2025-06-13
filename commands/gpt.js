const axios = require('axios');

module.exports = {
  name: 'gpt',
  alias: [],
  category: 'ai',
  desc: 'Chat with GPT-style AI',
  async exec(sock, m, args, prefix) {
    if (!args.length) {
      return m.reply(`🧠 Usage: ${prefix}gpt how does gravity work?`);
    }

    const query = args.join(' ');
    try {
      m.reply('💭 Thinking...');
      const res = await axios.get(`https://api.kenzieapi.xyz/gpt?q=${encodeURIComponent(query)}`);
      const reply = res.data?.response || "⚠️ No response from AI.";
      sock.sendMessage(m.chat, { text: `🤖 ${reply}` }, { quoted: m });
    } catch (err) {
      console.error(err);
      m.reply("❌ Error reaching GPT service.");
    }
  }
};
