let antiDeleteChats = {};

const enableAntiDelete = (jid) => {
  antiDeleteChats[jid] = true;
};

const disableAntiDelete = (jid) => {
  delete antiDeleteChats[jid];
};

const isAntiDeleteOn = (jid) => {
  return antiDeleteChats[jid] === true;
};

module.exports = {
  enableAntiDelete,
  disableAntiDelete,
  isAntiDeleteOn
};
