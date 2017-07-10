import TelegramBot from 'node-telegram-bot-api';
import config from '../../env/bot.config';
import { createUser, getUser } from '../models/users';
import { saveSearchInfo } from '../models/search_keywords';
import receivedMessage from './utils/telegram_receivedMessage';

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

// 番號
bot.onText(/[#＃]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  await saveSearchInfo(messageText, 'code');
  const strArr = await receivedMessage(message, messageText, 'code');

  /* eslint-disable */
  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
  /* eslint-enable */
});

// 女優
bot.onText(/[%％]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  await saveSearchInfo(messageText, 'models');
  const strArr = await receivedMessage(message, messageText, 'models');

  /* eslint-disable */
  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
  /* eslint-enable */
});

// 片名
bot.onText(/[@＠]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  await saveSearchInfo(messageText, 'title');
  const strArr = await receivedMessage(message, messageText, 'title');

  /* eslint-disable */
  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
  /* eslint-enable */
});

bot.onText(/^PPAV$/i, async (message) => {
  const chatId = message.chat.id;

  const strArr = await receivedMessage(message, 'PPAV');

  /* eslint-disable */
  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
  /* eslint-enable */
});

bot.on('message', async (message) => {
  const chatId = message.chat.id;

  const str = `想看片請輸入 "PPAV"

    其他搜尋功能🔥
    1. 搜尋番號："# + 番號"
    2. 搜尋女優："% + 女優"
    3. 搜尋片名："@ + 關鍵字"`;

  await bot.sendMessage(chatId, str);
});

export default bot;
