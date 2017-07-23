import * as keyboards from './keyboards';
import locale from '../locale';

const replyKeyboardOptions = (keyboard, onTimeKeyboard) => ({
  reply_markup: {
    keyboard,
    resize_keyboard: true,
    one_time_keyboard: onTimeKeyboard,
  },
  parse_mode: 'Markdown',
  disable_web_page_preview: false,
});

const inlineKeyboardOptions = keyboard => ({
  reply_markup: {
    inline_keyboard: keyboard,
  },
  parse_mode: 'Markdown',
  disable_web_page_preview: false,
});

const getLanguageKeyboardSettings = () => {
  const text = '請選擇 PPAV 使用語言 🌐\nPlease choose PPAV usage language 🌐';
  const options = replyKeyboardOptions(keyboards.languageKeyboard, true);

  return { text, options };
};

const getAutoDeleteMessagesKeyboardSettings = languageCode => {
  const { text, active, inactive } = locale(languageCode).autoDeleteMessages;
  const autoDeleteMessagesKeyboard = keyboards.autoDeleteMessagesKeyboard(
    active,
    inactive
  );

  const options = replyKeyboardOptions(autoDeleteMessagesKeyboard, true);

  return { text, options };
};

const getDisclaimerKeyboardSettings = languageCode => {
  const { text, accept, refuse } = locale(languageCode).acceptDisclaimer;
  const disclaimerKeyboard = keyboards.disclaimerKeyboard(accept, refuse);

  const options = replyKeyboardOptions(disclaimerKeyboard, true);

  return { text, options };
};

const getMainMenuKeyboardSettings = languageCode => {
  const { text, about, checkDisclaimer, report, contactUs, setting } = locale(
    languageCode
  ).mainMenu;
  const mainMenuKeyboard = keyboards.mainMenuKeyboard(
    about,
    checkDisclaimer,
    report,
    contactUs,
    setting
  );

  const options = replyKeyboardOptions(mainMenuKeyboard, false);

  return { text, options };
};

const getContactUsKeyboardSettings = languageCode => {
  const { text, mailText, mailUrl } = locale(languageCode).contactUs;
  const contactUsKeyboard = keyboards.contactUsKeyboard(mailText, mailUrl);

  const options = inlineKeyboardOptions(contactUsKeyboard);

  return { text, options };
};

const getSettingKeyboardSettings = languageCode => {
  const { text, buttons } = locale(languageCode).setting;
  const settingKeyboard = keyboards.settingKeyboard(buttons);

  const options = inlineKeyboardOptions(settingKeyboard);

  return { text, options };
};

export {
  getLanguageKeyboardSettings,
  getDisclaimerKeyboardSettings,
  getMainMenuKeyboardSettings,
  getContactUsKeyboardSettings,
  getSettingKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
};
