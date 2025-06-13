const moment = require('moment-timezone');

const getTime = () => {
  return moment().tz("Africa/Nairobi").format("HH:mm:ss");
};

const getDate = () => {
  return moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
};

const fancyText = (text) => {
  return `➤ ${text}`;
};

const isUrl = (url) => {
  return /https?:\/\/[^\s]+/.test(url);
};

module.exports = {
  getTime,
  getDate,
  fancyText,
  isUrl
};
