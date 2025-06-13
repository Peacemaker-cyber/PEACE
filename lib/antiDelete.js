let antiDeleteChats = {};

const enableAntiDelete = (jid, mode = 'chat') => {
  antiDeleteChats[jid] = mode;
};

const disableAntiDelete = (jid) => {
  delete antiDeleteChats[jid];
};

const getAntiDeleteMode = (jid) => {
  return antiDeleteChats[jid] || null;
};

const isAntiDeleteOn = (jid) => {
  return jid in antiDeleteChats;
};

module.exports = {
  enableAntiDelete,
  disableAntiDelete,
  isAntiDeleteOn,
  getAntiDeleteMode
};
