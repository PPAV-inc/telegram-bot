import {
  TelegramHandlerBuilder,
  MiddlewareHandlerBuilder,
} from 'toolbot-core-experiment';
// import axios from 'axios';
// import sleep from 'sleep-promise';
// import path from 'path';

import bot from './telegramBot';
import locale from './locale';

import startHandlerMiddleware from './middleware/startHandlerMiddleware';
import mainHandlerMiddleware from './middleware/mainHandlerMiddleware';

import * as users from '../models/users';
import saveSearchInfo from '../models/search_keywords';
// import { getAnalyticVideos } from '../models/videos';

import getQueryResult from './utils/getQueryResult';
import * as keyboards from './utils/getKeyboardSettings';
import parseAction from './utils/parseAction';
// import deleteMessage from './utils/deleteMessage';
/*
const { imageAnalyticUrl } = require(path.resolve(
  __dirname,
  '../../env/bot.config'
));
*/

const builder = new TelegramHandlerBuilder();

// bot.on('message', async message => {
//   await bot.sendChatAction(message.chat.id, 'typing');
// });
//
// bot.on(
//   'photo',
//   responseMiddleware.go(async response => {
//     const { chatId, user, mssage } = response;
//     const { prePostText, searchingGifUrl } = locale(
//       user.languageCode
//     ).imageAnalytic;
//
//     await bot.sendDocument(chatId, searchingGifUrl, { caption: prePostText });
//
//     const image = await bot.getFileLink(mssage.photo.pop().file_id);
//     try {
//       const { data: analyticResult } = await axios.post(
//         imageAnalyticUrl,
//         {
//           image,
//         },
//         {
//           timeout: 30000,
//         }
//       );
//
//       switch (analyticResult.isFaceExist) {
//         case 1: {
//           const result = await getAnalyticVideos(analyticResult.candidate);
//           const photos = await keyboards.getImageAnalyticKeyboardSettings(
//             user.languageCode,
//             result
//           );
//
//           /* eslint-disable */
//           for (let i = 0; i < photos.length; i += 1) {
//             const { message_id: sentMessageId } = await bot.sendMessage(
//               chatId,
//               photos[i].text,
//               photos[i].options
//             );
//
//             if (user.autoDeleteMessages) {
//               await deleteMessage(chatId, sentMessageId, bot);
//             }
//
//             await sleep(500);
//           }
//           /* eslint-enable */
//
//           break;
//         }
//         case 0: {
//           const { notFound } = locale(user.languageCode).imageAnalytic;
//           await bot.sendMessage(chatId, notFound, { parse_mode: 'Markdown' });
//           break;
//         }
//         case -1: {
//           const { foundMoreThanOne } = locale(user.languageCode).imageAnalytic;
//           await bot.sendMessage(chatId, foundMoreThanOne, {
//             parse_mode: 'Markdown',
//           });
//           break;
//         }
//         default: {
//           const { notFound } = locale(user.languageCode).imageAnalytic;
//           await bot.sendMessage(chatId, notFound, { parse_mode: 'Markdown' });
//           break;
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   })
// );
//

// 搜尋 番號、標題、女優
builder.onText(/([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/, async context => {
  const match = context.event._rawEvent.message.text.match(
    /([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/i
  );
  const { user } = context;
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

  const { totalCount, result } = await getQueryResult(type, keyword, firstPage);

  if (totalCount === 0) {
    await context.sendMessage(locale(user.languageCode).videos.notFound, {
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

    // FIXME
    // const { message_id: sentMessageId } = await context.sendMessage(
    //   text,
    //   options
    // );
    //
    // if (user.autoDeleteMessages) {
    //   await deleteMessage(sentMessageId, context);
    // }

    await context.sendMessage(text, options);
    await saveSearchInfo(keyword, type);
  }
});

// PPAV
builder.onText(/^PPAV$/i, async context => {
  const { user } = context;
  const result = await getQueryResult('PPAV');

  const { text, options } = await keyboards.getRandomVideoKeyboardSettings(
    user.languageCode,
    result
  );

  await context.sendMessage(text, options);
  //   const { message_id: sentMessageId } = await context.sendMessage(
  //     text,
  //     options
  //   );
  //
  //   if (user.autoDeleteMessages) {
  //     await deleteMessage(chatId, sentMessageId, bot);
  //   }
});

// 設定
builder.onText(/(設置|Setting) ⚙️$/i, async context => {
  const { user } = context;
  const { text, options } = keyboards.getSettingKeyboardSettings(
    user.languageCode
  );

  await context.sendMessage(text, options);
});

// 關於 PPAV
builder.onText(/(關於 PPAV|About PPAV) 👀$/i, async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).about, {
    parse_mode: 'Markdown',
  });
});

// 免責聲明
builder.onText(/(免責聲明|Disclaimer) 📜$/i, async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).disclaimer, {
    parse_mode: 'Markdown',
  });
});

// 意見回饋
builder.onText(/(意見回饋|Report) 🙏$/i, async context => {
  await context.sendMessage(locale().reportUrl, {
    parse_mode: 'Markdown',
  });
});

// 聯絡我們
builder.onText(/(聯絡我們|Contact PPAV) 📩$/i, async context => {
  const { user } = context;
  const { text, options } = keyboards.getContactUsKeyboardSettings(
    user.languageCode
  );

  await context.sendMessage(text, options);
});

// // 啟動/關閉 閱後即焚
// bot.onText(
//   /(啟動|active) 🔥$|(關閉|Inactive) ❄️$/i,
//   responseMiddleware.go(async context => {
//     const { user, match, chatId } = context;
//     const { languageCode, autoDeleteMessages } = user;
//     const active = match[0].indexOf('🔥') > 0;
//     if (!autoDeleteMessages && active) {
//       await users.updateUser(chatId, { autoDeleteMessages: true });
//     } else if (autoDeleteMessages && !active) {
//       await users.updateUser(chatId, { autoDeleteMessages: false });
//     }
//
//     const confirmText = active
//       ? locale(languageCode).autoDeleteMessages.alreadyActive
//       : locale(languageCode).autoDeleteMessages.alreadyInactive;
//
//     await context.sendMessage(confirmText, { parse_mode: 'Markdown' });
//
//     const { text, options } = keyboards.getMainMenuKeyboardSettings(
//       languageCode
//     );
//     await context.sendMessage(text, options);
//   })
// );

// unmatched message
builder.onText(/.+/, async context => {
  const str = `*想看片請輸入 "PPAV"*

  其他搜尋功能 🔥
  1. 搜尋番號："*# + 番號*"
  2. 搜尋女優："*% + 女優*"
  3. 搜尋片名："*@ + 關鍵字*"`;

  await context.sendMessage(str, { parse_mode: 'Markdown' });
});

builder.onCallbackQuery(/.*/, async context => {
  const {
    from: { id: userId },
    message: { message_id, chat: { id: chatId } },
    data: action,
  } = context.event._rawEvent;

  const { languageCode } = await users.getUser(userId);
  const { text, options } = await parseAction(action, languageCode);

  if (text.indexOf(':') > -1) {
    await context.editMessageText(text, {
      chat_id: chatId,
      message_id,
      ...options,
    });
  } else {
    await context.sendMessage(text, options);
  }
});
//
// const handler = builder.build();

const middlewareHandlerBuilder = new MiddlewareHandlerBuilder()
  .use(startHandlerMiddleware)
  .use(mainHandlerMiddleware);

bot.handle(middlewareHandlerBuilder.build());

export default bot;
