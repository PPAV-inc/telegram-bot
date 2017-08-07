import axios from 'axios';
import sleep from 'sleep-promise';
import path from 'path';

import bot from './telegramBot';
import locale from './locale';
import botimize from '../botimize';

import Middleware from './middleware/Middleware';
import checkUserAcceptDisclaimer from './middleware/checkUserAcceptDisclaimer';

import { getAnalyticVideos } from '../models/videos';
import * as users from '../models/users';
import saveSearchInfo from '../models/search_keywords';

import getQueryResult from './utils/getQueryResult';
import * as keyboards from './utils/getKeyboardSettings';
import parseAction from './utils/parseAction';
import deleteMessage from './utils/deleteMessage';

const { imageAnalyticUrl } = require(path.resolve(
  __dirname,
  '../../env/bot.config'
));

const responseMiddleware = new Middleware();
responseMiddleware.use(checkUserAcceptDisclaimer);

bot.on('message', async message => {
  await bot.sendChatAction(message.chat.id, 'typing');
});

bot.on(
  'photo',
  responseMiddleware.go(async response => {
    const { chatId, user, mssage } = response;
    const { prePostText, searchingGifUrl } = locale(
      user.languageCode
    ).imageAnalytic;

    await bot.sendDocument(chatId, searchingGifUrl, { caption: prePostText });

    const image = await bot.getFileLink(mssage.photo.pop().file_id);
    try {
      const { data: analyticResult } = await axios.post(
        imageAnalyticUrl,
        {
          image,
        },
        {
          timeout: 30000,
        }
      );

      switch (analyticResult.isFaceExist) {
        case 1: {
          const result = await getAnalyticVideos(analyticResult.candidate);
          const photos = await keyboards.getImageAnalyticKeyboardSettings(
            user.languageCode,
            result
          );

          /* eslint-disable */
          for (let i = 0; i < photos.length; i += 1) {
            const { message_id: sentMessageId } = await bot.sendMessage(
              chatId,
              photos[i].text,
              photos[i].options
            );
            botimize.sendOutgoingLog(chatId, photos[i].text);

            if (user.autoDeleteMessages) {
              await deleteMessage(chatId, sentMessageId, bot);
            }

            await sleep(500);
          }
          /* eslint-enable */

          break;
        }
        case 0: {
          const { notFound } = locale(user.languageCode).imageAnalytic;
          await bot.sendMessage(chatId, notFound, { parse_mode: 'Markdown' });
          botimize.sendOutgoingLog(chatId, notFound);
          break;
        }
        case -1: {
          const { foundMoreThanOne } = locale(user.languageCode).imageAnalytic;
          await bot.sendMessage(chatId, foundMoreThanOne, {
            parse_mode: 'Markdown',
          });
          botimize.sendOutgoingLog(chatId, foundMoreThanOne);
          break;
        }
        default: {
          const { notFound } = locale(user.languageCode).imageAnalytic;
          await bot.sendMessage(chatId, notFound, { parse_mode: 'Markdown' });
          botimize.sendOutgoingLog(chatId, notFound);
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  })
);

// 開始對話
bot.onText(/\/start/, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const user = await users.getUser(userId);
  if (!user) {
    await users.createUser(message);
  }

  await bot.sendMessage(
    chatId,
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n*♥️♥️ Welcome to PPAV ♥️♥️*',
    { parse_mode: 'Markdown' }
  );

  const { text, options } = keyboards.getLanguageKeyboardSettings();
  await bot.sendMessage(chatId, text, options);
  botimize.sendOutgoingLog(chatId, text);
});

// 更新使用者語言
bot.onText(/(繁體中文|English)$/i, async message => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const languageCode = message.text === '繁體中文' ? 'zh-TW' : 'en';

  await users.updateUser(userId, { languageCode });

  await bot.sendMessage(chatId, locale(languageCode).updateUserLanguage, {
    parse_mode: 'Markdown',
  });

  await checkUserAcceptDisclaimer(async () => {
    const { text, options } = keyboards.getMainMenuKeyboardSettings(
      languageCode
    );
    await bot.sendMessage(chatId, text, options);
    botimize.sendOutgoingLog(chatId, text);
  })(message);
});

// 接受/不接受 免責聲明
bot.onText(/(接受|Accept) ✅$|(不接受|Refuse) ❌$/i, async (message, match) => {
  const { from: { id: userId }, chat: { id: chatId } } = message;
  const accept = match[0].indexOf('✅') > 0;
  const { languageCode } = await users.getUser(userId);

  await users.updateUser(userId, { acceptDisclaimer: accept });

  const confirmText = accept
    ? locale(languageCode).acceptDisclaimer.alreadyAccept
    : locale(languageCode).acceptDisclaimer.alreadyRefuse;

  await bot.sendMessage(chatId, confirmText, {
    parse_mode: 'Markdown',
  });

  if (accept) {
    const { text, options } = keyboards.getMainMenuKeyboardSettings(
      languageCode
    );
    await bot.sendMessage(chatId, text, options);
    botimize.sendOutgoingLog(chatId, text);
  }
});

// 搜尋 番號、標題、女優
bot.onText(
  /([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/,
  responseMiddleware.go(async response => {
    const { match, chatId, user } = response;
    let type = match[1];
    const keyword = match[2];
    const firstPage = 1;

    if (match[1] === '#' || match[1] === '＃') {
      type = 'code';
    } else if (match[1] === '%' || match[1] === '％') {
      type = 'models';
    } else {
      type = 'title';
    }

    const { totalCount, result } = await getQueryResult(
      type,
      keyword,
      firstPage
    );

    if (totalCount === 0) {
      await bot.sendMessage(chatId, locale(user.languageCode).videos.notFound, {
        parse_mode: 'Markdown',
      });
    } else {
      const { text, options } = await keyboards.getVideoSourcesKeyboardSettings(
        user.languageCode,
        keyword,
        result,
        type,
        firstPage,
        totalCount
      );

      const { message_id: sentMessageId } = await bot.sendMessage(
        chatId,
        text,
        options
      );
      botimize.sendOutgoingLog(chatId, text);

      await saveSearchInfo(type, keyword);

      if (user.autoDeleteMessages) {
        await deleteMessage(chatId, sentMessageId, bot);
      }
    }
  })
);

// PPAV
bot.onText(
  /^PPAV$/i,
  responseMiddleware.go(async response => {
    const { user, chatId } = response;
    const result = await getQueryResult('PPAV');

    const { text, options } = await keyboards.getRandomVideoKeyboardSettings(
      user.languageCode,
      result
    );

    const { message_id: sentMessageId } = await bot.sendMessage(
      chatId,
      text,
      options
    );
    botimize.sendOutgoingLog(chatId, text);

    if (user.autoDeleteMessages) {
      await deleteMessage(chatId, sentMessageId, bot);
    }
  })
);

// 設定
bot.onText(
  /(設置|Setting) ⚙️$/i,
  responseMiddleware.go(async response => {
    const { user, chatId } = response;
    const { text, options } = keyboards.getSettingKeyboardSettings(
      user.languageCode
    );

    await bot.sendMessage(chatId, text, options);
    botimize.sendOutgoingLog(chatId, text);
  })
);

// 關於 PPAV
bot.onText(
  /(關於 PPAV|About PPAV) 👀$/i,
  responseMiddleware.go(async response => {
    const { user, chatId } = response;
    const text = locale(user.languageCode).about;
    await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
    });
    botimize.sendOutgoingLog(chatId, text);
  })
);

// 免責聲明
bot.onText(
  /(免責聲明|Disclaimer) 📜$/i,
  responseMiddleware.go(async response => {
    const { user, chatId } = response;
    const text = locale(user.languageCode).disclaimer;
    await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
    });
    botimize.sendOutgoingLog(chatId, text);
  })
);

// 意見回饋
bot.onText(
  /(意見回饋|Report) 🙏$/i,
  responseMiddleware.go(async response => {
    const text = locale().reportUrl;
    await bot.sendMessage(response.chatId, text, {
      parse_mode: 'Markdown',
    });
    botimize.sendOutgoingLog(response.chatId, text);
  })
);

// 聯絡我們
bot.onText(
  /(聯絡我們|Contact PPAV) 📩$/i,
  responseMiddleware.go(async response => {
    const { user, chatId } = response;
    const { text, options } = keyboards.getContactUsKeyboardSettings(
      user.languageCode
    );

    await bot.sendMessage(chatId, text, options);
    botimize.sendOutgoingLog(chatId, text);
  })
);

// 啟動/關閉 閱後即焚
bot.onText(
  /(啟動|active) 🔥$|(關閉|Inactive) ❄️$/i,
  responseMiddleware.go(async response => {
    const { user, match, chatId } = response;
    const { languageCode, autoDeleteMessages } = user;
    const active = match[0].indexOf('🔥') > 0;
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

    const { text, options } = keyboards.getMainMenuKeyboardSettings(
      languageCode
    );
    await bot.sendMessage(chatId, text, options);
    botimize.sendOutgoingLog(chatId, text);
  })
);

// unmatched message
bot.onText(
  /.+/,
  responseMiddleware.go(async response => {
    const text = `*想看片請輸入 "PPAV"*

  其他搜尋功能 🔥
  1. 搜尋番號："*# + 番號*"
  2. 搜尋女優："*% + 女優*"
  3. 搜尋片名："*@ + 關鍵字*"`;

    await bot.sendMessage(response.chatId, text, { parse_mode: 'Markdown' });
    botimize.sendOutgoingLog(response.chatId, text);
  })
);

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
  botimize.sendOutgoingLog(chatId, text);
});

export default bot;
