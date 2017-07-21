import TelegramBot from 'node-telegram-bot-api';
import { botToken, url } from '../../env/bot.config';
import * as users from '../models/users';
import saveSearchInfo from '../models/search_keywords';
import getQueryResult from './utils/getQueryResult';
import {
  getLanguageKeyboardSettings,
  getMainMenuKeyboardSettings,
  getContactUsKeyboardSettings,
  getSettingKeyboardSettings,
  getVideoSourcesKeyboardSettings,
} from './utils/getKeyboardSettings';
import parseAction from './utils/parseAction';
import checkUserAcceptDisclaimer from './utils/checkUserAcceptDisclaimer';
import deleteMessage from './utils/deleteMessage';
import locale from './locale';

const bot = new TelegramBot(botToken, { polling: true, onlyFirstMatch: true });
bot.setWebHook(`${url}/bot${botToken}`);

bot.on('message', async message => {
  await bot.sendChatAction(message.chat.id, 'typing');
});

// 開始對話
bot.onText(/\/start/, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.users.getUser(userId);
  if (!user) {
    await users.createUser(message);
  }

  await bot.sendMessage(
    chatId,
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n*♥️♥️ Welcome to PPAV ♥️♥️*',
    { parse_mode: 'Markdown' }
  );

  const { text, options } = getLanguageKeyboardSettings();
  await bot.sendMessage(chatId, text, options);
});

// 更新使用者語言
bot.onText(/🇹🇼|🇺🇲/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.users.getUser(userId);
  const languageCode = message.text === '🇹🇼' ? 'zh-TW' : 'en';

  await users.updateUser(userId, { languageCode });

  await bot.sendMessage(chatId, locale(languageCode).users.updateUserLanguage, {
    parse_mode: 'Markdown',
  });

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    const { text, options } = getMainMenuKeyboardSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 接受/不接受 免責聲明
bot.onText(/(接受|Accept) ✅$|(不接受|Refuse) ❌$/i, async (message, match) => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const accept = match[0].indexOf('✅') > 0;
  const { languageCode } = await users.getUser(userId);

  if (accept) {
    await users.updateUser(userId, { acceptDisclaimer: true });
  } else {
    await users.updateUser(userId, { acceptDisclaimer: false });
  }

  const confirmText = accept
    ? locale(languageCode).acceptDisclaimer.alreadyAccept
    : locale(languageCode).acceptDisclaimer.alreadyRefuse;

  await bot.sendMessage(chatId, confirmText, {
    parse_mode: 'Markdown',
  });

  if (accept) {
    const { text, options } = getMainMenuKeyboardSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 搜尋 番號、標題、女優
bot.onText(/([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/, async (message, match) => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);
  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    let type = match[1];
    const query = match[2];
    const firstPage = 0;

    if (match[1] === '#' || match[1] === '＃') {
      type = 'code';
    } else if (match[1] === '%' || match[1] === '％') {
      type = 'model';
    } else {
      type = 'title';
    }

    const { keyword, result } = await getQueryResult(type, query, firstPage);

    if (!result) {
      const str = await bot.sendMessage(
        chatId,
        locale(user.languageCode).videos.notFound,
        {
          parse_mode: 'Markdown',
        }
      );
      await bot.sendMessage(chatId, str);
    } else {
      const { text, options } = await getVideoSourcesKeyboardSettings(
        user.languageCode,
        query,
        result,
        type,
        firstPage
      );

      const { message_id: sentMessageId } = await bot.sendMessage(
        chatId,
        text,
        options
      );

      await saveSearchInfo(keyword, type);

      if (user.autoDeleteMessages) {
        await deleteMessage(chatId, sentMessageId, bot);
      }
    }
  }
});

// PPAV
bot.onText(/^PPAV$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    const strArr = await getQueryResult('PPAV');
    let sentMessageId = 0;

    /* eslint-disable */
    for (const str of strArr) {
      const { message_id } = await bot.sendMessage(chatId, str);
      sentMessageId = message_id;
    }
    /* eslint-enable */

    if (user.autoDeleteMessages) {
      await deleteMessage(chatId, sentMessageId, bot);
    }
  }
});

// 設定
bot.onText(/(設置|Setting) ⚙️$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    const { text, options } = getSettingKeyboardSettings(user.languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 關於 PPAV
bot.onText(/(關於 PPAV|About PPAV) 👀$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    await bot.sendMessage(chatId, locale(user.languageCode).about, {
      parse_mode: 'Markdown',
    });
  }
});

// 免責聲明
bot.onText(/(免責聲明|Disclaimer) 📜$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    await bot.sendMessage(chatId, locale(userId.languageCode).disclaimer, {
      parse_mode: 'Markdown',
    });
  }
});

// 意見回饋
bot.onText(/(意見回饋|Report) 🙏$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    await bot.sendMessage(chatId, locale().reportUrl, {
      parse_mode: 'Markdown',
    });
  }
});

// 聯絡我們
bot.onText(/(聯絡我們|Contact PPAV) 📩$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);

  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    const { text, options } = getContactUsKeyboardSettings(user.languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// 啟動/關閉 閱後即焚
bot.onText(/(啟動|active) 🔥$|(關閉|Inactive) ❄️$/i, async (message, match) => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);
  const { languageCode, autoDeleteMessages } = user;
  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);
  const active = match[0].indexOf('🔥') > 0;

  if (alreadyAccept) {
    if (!autoDeleteMessages && active) {
      await users.updateUser(chatId, { autoDeleteMessages: true });
    } else if (autoDeleteMessages && !active) {
      await users.updateUser(chatId, { autoDeleteMessages: false });
    }

    const confirmText = active
      ? locale(languageCode).autoDeleteMessages.alreadyActive
      : locale(languageCode).autoDeleteMessages.alreadyInactive;

    await bot.sendMessage(chatId, confirmText, {
      parse_mode: 'Markdown',
    });

    const { text, options } = getMainMenuKeyboardSettings(languageCode);

    await bot.sendMessage(chatId, text, options);
  }
});

// unmatched message
bot.onText(/.+/, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);
  const alreadyAccept = await checkUserAcceptDisclaimer(user, chatId, bot);

  if (alreadyAccept) {
    const str = `*想看片請輸入 "PPAV"*

  其他搜尋功能 🔥
  1. 搜尋番號："*# + 番號*"
  2. 搜尋女優："*% + 女優*"
  3. 搜尋片名："*@ + 關鍵字*"`;

    await bot.sendMessage(chatId, str, { parse_mode: 'Markdown' });
  }
});

bot.on('callback_query', async callbackQuery => {
  const {
    from: { id: userId },
    message: { message_id, chat: { id: chatId } },
    data: action,
  } = callbackQuery;

  const { languageCode } = await users.getUser(userId);
  const { text, options } = await parseAction(action, languageCode);

  if (text.indexOf(':') > -1) {
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id,
      ...options,
    });
  } else {
    await bot.sendMessage(chatId, text, options);
  }
});

export default bot;
