import path from 'path';

const { botToken, botimizeToken } = require(path.resolve(
  __dirname,
  '../env/bot.config.js'
));

const botimize = require('botimize')(botimizeToken, 'telegram'); // eslint-disable-line

botimize.sendOutgoingLog = messageBody => {
  const outgoingLog = {
    ...messageBody,
    accessToken: botToken,
  };
  botimize.logOutgoing(outgoingLog, { parse: 'pure' });
};

export default botimize;
