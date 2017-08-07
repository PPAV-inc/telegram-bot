import path from 'path';

const { botToken, botimizeToken } = require(path.resolve(
  __dirname,
  '../env/bot.config.js'
));

const botimize = require('botimize')(botimizeToken, 'telegram');

botimize.sendOutgoingLog = (chatId, text) => {
  const outgoingLog = {
    chat_id: chatId,
    text,
    token: botToken,
  };
  botimize.logOutgoing(outgoingLog, { parse: 'pure' });
};

export default botimize;
