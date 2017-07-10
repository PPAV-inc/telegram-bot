import TelegramBot from 'node-telegram-bot-api';
import config from '../../env/bot.config';
import { createUser, getUser } from '../models/users';

const { botToken, url } = config;

const bot = new TelegramBot(botToken, { polling: true });
bot.setWebHook(`${url}/bot${botToken}`);

bot.onText(/\/start/, async msg => {
  const user = await getUser(msg.from.id);
  if (!user) {
    await createUser(msg);
  }
  bot.sendMessage(msg.chat.id, 'I am alive!');
});

export default bot;
