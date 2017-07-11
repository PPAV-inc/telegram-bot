import TelegramBot from 'node-telegram-bot-api';
import config from '../../env/bot.config';
import { createUser, getUser, updateUserLanguage } from '../models/users';
import { saveSearchInfo } from '../models/search_keywords';
import receivedMessage from './utils/telegram_receivedMessage';
import { sendLanguageKeyboard } from './utils/sendKeyboard';
import locale from './locale';

const { botToken, url } = config;

const bot = new TelegramBot(botToken, { polling: true, onlyFirstMatch: true });
bot.setWebHook(`${url}/bot${botToken}`);

bot.onText(/\/start/, async message => {
  const user = await getUser(message.from.id);
  if (!user) {
    await createUser(message);
  }
  await sendLanguageKeyboard(bot, message.chat.id);
});

// 更新使用者語言
bot.onText(/🇹🇼|🇺🇲/i, async message => {
  const chatId = message.chat.id;
  let languageCode = '';
  if (message.text === '🇹🇼') {
    languageCode = 'zh-TW';
    await updateUserLanguage(chatId, languageCode);
  } else {
    languageCode = 'en';
    await updateUserLanguage(chatId, languageCode);
  }
  await bot.sendMessage(chatId, locale(languageCode).updateUserLanguage, {
    parse_mode: 'Markdown',
  });
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

bot.onText(/^PPAV$/i, async message => {
  const chatId = message.chat.id;

  const strArr = await receivedMessage(message, 'PPAV');

  /* eslint-disable */
  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
  /* eslint-enable */
});

// unmatched message
bot.onText(/.+/, async message => {
  const chatId = message.chat.id;

  const str = `*想看片請輸入 "PPAV"*

  其他搜尋功能🔥
  1. 搜尋番號："# + 番號"
  2. 搜尋女優："% + 女優"
  3. 搜尋片名："@ + 關鍵字"`;

  await bot.sendMessage(chatId, str, { parse_mode: 'Markdown' });
});

export default bot;
