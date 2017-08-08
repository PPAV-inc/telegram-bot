import path from 'path';

jest.mock(path.resolve(__dirname, '../../env/bot.config.js'));

const config = require(path.resolve(__dirname, '../../env/bot.config'));
config.botToken = '__TELEGRAM_BOT_TOKEN__';
config.botimizeToken = '__BOTIMIZE_TOKEN__';

const botimize = require('../botimize').default;

describe('botimize', () => {
  it('should be defined', () => {
    expect(botimize).toBeDefined();
  });

  it('should call botimize.logOutgoing', () => {
    const chatId = 1;
    const text = 'botimize cool';
    const outgoingLog = {
      chat_id: chatId,
      text,
      token: config.botToken,
    };
    botimize.logOutgoing = jest.fn();

    botimize.sendOutgoingLog(chatId, text);

    expect(botimize.logOutgoing).toBeCalledWith(outgoingLog, { parse: 'pure' });
  });
});
