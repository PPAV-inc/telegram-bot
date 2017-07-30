import TelegramBot from 'node-telegram-bot-api';
import { botToken, url } from '../../env/bot.config';

const options = {
  polling: true,
  onlyFirstMatch: true,
};

const bot = new TelegramBot(botToken, options);

bot.setWebHook(`${url}/bot${botToken}`);

export default bot;
