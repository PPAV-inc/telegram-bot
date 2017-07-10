import * as keyboards from './keyboards';

const sendInlineKeyboard = async (bot, chatId, text, keyboard) => {
  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
      resize_keyboard: true,
    },
    disable_web_page_preview: 'false',
  };
  await bot.sendMessage(chatId, text, options);
};

const sendLanguageKeyboard = async (bot, chatId) => {
  const text = '請選擇使用語言\nPlease choose usage language';
  await sendInlineKeyboard(bot, chatId, text, keyboards.languageKeyboard);
};

export { sendLanguageKeyboard };
