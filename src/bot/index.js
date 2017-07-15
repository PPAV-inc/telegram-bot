import TelegramBot from 'node-telegram-bot-api';
import sleep from 'sleep';
import config from '../../env/bot.config';
import { createUser, getUser, updateUser } from '../models/users';
import { saveSearchInfo } from '../models/search_keywords';
import getQueryResult from './utils/getQueryResult';
import {
  getLanguageKeyboarSettings,
  getDisclaimerKeyboarSettings,
  getMainMenuKeyboarSettings,
  getContactUsKeyboarSettings,
  getSettingKeyboarSettings,
} from './utils/getKeyboardSettings';
import parseAction from './utils/parseAction';
import locale from './locale';

const { botToken, url, delayMiliseconds } = config;

const bot = new TelegramBot(botToken, { polling: true, onlyFirstMatch: true });
bot.setWebHook(`${url}/bot${botToken}`);

// 檢查是否接受免責聲明
const checkUserAcceptDisclaimer = async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const { acceptDisclaimer, languageCode } = await getUser(userId);

  if (acceptDisclaimer) {
    return true;
  }

  await bot.sendMessage(chatId, locale(languageCode).disclaimer, {
    parse_mode: 'Markdown',
  });

  sleep.msleep(delayMiliseconds);

  const { text, options } = getDisclaimerKeyboarSettings(languageCode);
  await bot.sendMessage(chatId, text, options);

  return false;
};

bot.on('message', async message => {
  await bot.sendChatAction(message.chat.id, 'typing');
});

// 開始對話
bot.onText(/\/start/, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await getUser(userId);
  if (!user) {
    await createUser(message);
  }

  await bot.sendMessage(
    chatId,
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n*♥️♥️ Welcome to PPAV ♥️♥️*',
    { parse_mode: 'Markdown' }
  );

  const { text, options } = getLanguageKeyboarSettings();
  await bot.sendMessage(chatId, text, options);
});

// 更新使用者語言
bot.onText(/🇹🇼|🇺🇲/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;

  const languageCode = message.text === '🇹🇼' ? 'zh-TW' : 'en';

  await updateUser(userId, { languageCode });

  await bot.sendMessage(chatId, locale(languageCode).updateUserLanguage, {
    parse_mode: 'Markdown',
  });

  sleep.msleep(delayMiliseconds);

  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { text, options } = getMainMenuKeyboarSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 接受免責聲明
bot.onText(/(接受|Accept) ✅$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;

  await updateUser(userId, { acceptDisclaimer: true });

  const { languageCode } = await getUser(userId);

  await bot.sendMessage(
    chatId,
    locale(languageCode).acceptDisclaimer.alreadyAccept,
    {
      parse_mode: 'Markdown',
    }
  );

  const { text, options } = getMainMenuKeyboarSettings(languageCode);

  await bot.sendMessage(chatId, text, options);
});

// 不接受免責聲明
bot.onText(/(不接受|Refuse) ❌$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;

  await updateUser(chatId, { acceptDisclaimer: false });

  const { languageCode } = await getUser(userId);

  await bot.sendMessage(
    chatId,
    locale(languageCode).acceptDisclaimer.alreadyRefuse,
    {
      parse_mode: 'Markdown',
    }
  );
});

// 番號
bot.onText(/[#＃]\s*\+*\s*(\S+)/, async (message, match) => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const chatId = message.chat.id;
    const messageText = match[1];

    await saveSearchInfo(messageText, 'code');
    const strArr = await getQueryResult(message, messageText, 'code');

    /* eslint-disable */
    for (const str of strArr) {
      await bot.sendMessage(chatId, str);
    }
    /* eslint-enable */
  }
});

// 女優
bot.onText(/[%％]\s*\+*\s*(\S+)/, async (message, match) => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const chatId = message.chat.id;
    const messageText = match[1];

    await saveSearchInfo(messageText, 'models');
    const strArr = await getQueryResult(message, messageText, 'models');

    /* eslint-disable */
    for (const str of strArr) {
      await bot.sendMessage(chatId, str);
    }
    /* eslint-enable */
  }
});

// 片名
bot.onText(/[@＠]\s*\+*\s*(\S+)/, async (message, match) => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const chatId = message.chat.id;
    const messageText = match[1];

    await saveSearchInfo(messageText, 'title');
    const strArr = await getQueryResult(message, messageText, 'title');

    /* eslint-disable */
    for (const str of strArr) {
      await bot.sendMessage(chatId, str);
    }
    /* eslint-enable */
  }
});

// PPAV
bot.onText(/^PPAV$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const chatId = message.chat.id;

    const strArr = await getQueryResult(message, 'PPAV');

    /* eslint-disable */
    for (const str of strArr) {
      await bot.sendMessage(chatId, str);
    }
    /* eslint-enable */
  }
});

// 設定
bot.onText(/(設置|Setting) ⚙️$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { from: { id: userId }, chat: { id: chatId } } = message;

    const { languageCode } = await getUser(userId);

    const { text, options } = getSettingKeyboarSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 關於 PPAV
bot.onText(/(關於 PPAV|About PPAV) 👀$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { from: { id: userId }, chat: { id: chatId } } = message;

    const { languageCode } = await getUser(userId);

    await bot.sendMessage(chatId, locale(languageCode).about, {
      parse_mode: 'Markdown',
    });
  }
});

// 免責聲明
bot.onText(/(免責聲明|Disclaimer) 📜$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { from: { id: userId }, chat: { id: chatId } } = message;

    const { languageCode } = await getUser(userId);

    await bot.sendMessage(chatId, locale(languageCode).disclaimer, {
      parse_mode: 'Markdown',
    });
  }
});

// 意見回饋
bot.onText(/(意見回饋|Report) 🙏$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { chat: { id: chatId } } = message;

    await bot.sendMessage(chatId, locale().reportUrl, {
      parse_mode: 'Markdown',
    });
  }
});

// 聯絡我們
bot.onText(/(聯絡我們|Contact PPAV) 📩$/i, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const { from: { id: userId }, chat: { id: chatId } } = message;

    const { languageCode } = await getUser(userId);

    const { text, options } = getContactUsKeyboarSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// unmatched message
bot.onText(/.+/, async message => {
  const alreadyAccept = await checkUserAcceptDisclaimer(message);

  if (alreadyAccept) {
    const chatId = message.chat.id;

    const str = `*想看片請輸入 "PPAV"*

  其他搜尋功能 🔥
  1. 搜尋番號："*# + 番號*"
  2. 搜尋女優："*% + 女優*"
  3. 搜尋片名："*@ + 關鍵字*"`;

    await bot.sendMessage(chatId, str, { parse_mode: 'Markdown' });
  }
});

bot.on('callback_query', async callbackQuery => {
  const { message: { chat: { id: chatId } }, data: action } = callbackQuery;

  const { text, options } = parseAction(action);
  await bot.sendMessage(chatId, text, options);
});

export default bot;
