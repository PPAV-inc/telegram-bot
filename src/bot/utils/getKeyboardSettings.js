import * as keyboards from './keyboards';
import locale from '../locale';

const replyKeyboardOptions = keyboard => ({
  reply_markup: {
    keyboard,
    resize_keyboard: true,
    one_time_keyboard: true,
  },
  parse_mode: 'Markdown',
  disable_web_page_preview: false,
});

const getLanguageKeyboarSettings = () => {
  const text =
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n請選擇 PPAV 使用語言\n\n*♥️♥️ Welcome to PPAV ♥️♥️*\nPlease choose PPAV usage language';
  const options = replyKeyboardOptions(keyboards.languageKeyboard);

  return { text, options };
};

const getDisclaimerKeyboarSettings = languageCode => {
  const { text, accept, refuse } = locale(languageCode).acceptDisclaimer;
  const disclaimerKeyboard = keyboards.disclaimerKeyboard(accept, refuse);

  const options = replyKeyboardOptions(disclaimerKeyboard);

  return { text, options };
};

export { getLanguageKeyboarSettings, getDisclaimerKeyboarSettings };
