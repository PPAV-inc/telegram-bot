import * as keyboards from './keyboards';

const sendInlineKeyboard = async (bot, chatId, text, keyboard) => {
  const options = {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
    parse_mode: 'Markdown',
    disable_web_page_preview: false,
  };
  await bot.sendMessage(chatId, text, options);
};

const sendLanguageKeyboard = async (bot, chatId) => {
  const text =
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n請選擇 PPAV 使用語言\n\n*♥️♥️ Welcome to PPAV ♥️♥️*\nPlease choose PPAV usage language';
  await sendInlineKeyboard(bot, chatId, text, keyboards.languageKeyboard);
};

export { sendLanguageKeyboard };
