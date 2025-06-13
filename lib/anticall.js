// lib/anticall.js
const { readFileSync, writeFileSync } = require('fs');
const file = './lib/anticall.json';

let db = [];
if (require('fs').existsSync(file)) {
  db = JSON.parse(readFileSync(file));
}

function save() {
  writeFileSync(file, JSON.stringify(db, null, 2));
}

module.exports = {
  isBlocked: (jid) => db.includes(jid),
  addBlocked: (jid) => {
    if (!db.includes(jid)) {
      db.push(jid);
      save();
    }
  },
  removeBlocked: (jid) => {
    const i = db.indexOf(jid);
    if (i !== -1) {
      db.splice(i, 1);
      save();
    }
  },
};
