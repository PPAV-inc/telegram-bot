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
  try {
    botimize.logOutgoing(outgoingLog, { parse: 'pure' });
  } catch (err) {
    console.log(err);
  }
};

export default botimize;
