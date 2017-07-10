import TelegramBot from 'node-telegram-bot-api';
import config from '../../env/bot.config';

const { botToken, url } = config;

const bot = new TelegramBot(botToken, { polling: true });
bot.setWebHook(`${url}/bot${botToken}`);

bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, 'I am alive!');
});

export default bot;
