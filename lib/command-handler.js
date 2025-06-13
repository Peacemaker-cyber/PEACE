const fs = require('fs');
const path = require('path');

const commands = new Map();

const loadCommands = (dir = './commands') => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file.endsWith('.js')) {
      try {
        const cmd = require(filePath);
        if (cmd.name && typeof cmd.exec === 'function') {
          commands.set(cmd.name, cmd);
          if (cmd.alias && Array.isArray(cmd.alias)) {
            for (const alias of cmd.alias) {
              commands.set(alias, cmd);
            }
          }
        }
      } catch (e) {
        console.error(`❌ Failed to load ${file}:`, e);
      }
    }
  }
};

const handleCommand = async (sock, m, prefix, ownerNumber, ownerName) => {
  const body = m?.message?.conversation || m?.message?.extendedTextMessage?.text || "";
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const cmd = commands.get(command);
  if (!cmd) return;

  try {
    await cmd.exec(sock, m, args, prefix, command, ownerName, ownerNumber);
  } catch (e) {
    console.error(`❌ Error in command ${command}:`, e);
    await sock.sendMessage(m.chat, { text: "⚠️ Error executing command!" }, { quoted: m });
  }
};

module.exports = {
  loadCommands,
  handleCommand,
};
