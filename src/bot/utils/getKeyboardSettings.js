import uniqueRandomArray from 'unique-random-array';
import * as keyboards from './keyboards';
import locale from '../locale';
import generateVideoMessageText from './generateVideoMessageText';

const replyKeyboardOptions = (keyboard, onTimeKeyboard) => ({
  reply_markup: {
    keyboard,
    resize_keyboard: true,
    one_time_keyboard: onTimeKeyboard,
  },
  parse_mode: 'Markdown',
  disable_web_page_preview: false,
});

const inlineKeyboardOptions = (keyboard) => ({
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

const getAutoDeleteMessagesKeyboardSettings = (languageCode) => {
  const { text, active, inactive } = locale(languageCode).autoDeleteMessages;
  const autoDeleteMessagesKeyboard = keyboards.autoDeleteMessagesKeyboard(
    active,
    inactive
  );
  const options = replyKeyboardOptions(autoDeleteMessagesKeyboard, true);

  return { text, options };
};

const getDisclaimerKeyboardSettings = (languageCode) => {
  const { text, accept, disclaimer } = locale(languageCode).acceptDisclaimer;
  const disclaimerKeyboard = keyboards.disclaimerKeyboard(disclaimer, accept);
  const options = replyKeyboardOptions(disclaimerKeyboard, true);

  return { text, options };
};

const getMainMenuKeyboardSettings = (languageCode) => {
  const {
    text,
    randomVideo,
    hotVideo,
    tutorial,
    about,
    report,
    checkDisclaimer,
    setting,
  } = locale(languageCode).mainMenu;
  const mainMenuKeyboard = keyboards.mainMenuKeyboard(
    randomVideo,
    hotVideo,
    tutorial,
    about,
    report,
    checkDisclaimer,
    setting
  );
  const options = replyKeyboardOptions(mainMenuKeyboard, false);

  return { text, options };
};

const getContactUsKeyboardSettings = (languageCode) => {
  const { text, mailText, mailUrl } = locale(languageCode).contactUs;
  const contactUsKeyboard = keyboards.contactUsKeyboard(mailText, mailUrl);

  const options = inlineKeyboardOptions(contactUsKeyboard);

  return { text, options };
};

const getSettingKeyboardSettings = (languageCode) => {
  const { text, buttons } = locale(languageCode).setting;
  const settingKeyboard = keyboards.settingKeyboard(buttons);
  const options = inlineKeyboardOptions(settingKeyboard);

  return { text, options };
};

const getSearchVideoKeyboardSettings = async (languageCode, result) => {
  const searchVideoKeyboard = await keyboards.searchVideoKeyboard(
    languageCode,
    result.videos
  );
  const options = {
    ...inlineKeyboardOptions(searchVideoKeyboard),
    caption: generateVideoMessageText(languageCode, result),
  };

  return {
    imageUrl: result.img_url
      ? result.img_url
      : 'https://i.imgur.com/H8BeuET.jpg',
    options,
  };
};

const getWatchMoreKeyboardSettings = (languageCode, keyword, nowPage) => {
  const text = `${
    locale(languageCode).videos.searchingKeyword
  }#${keyword}\n${uniqueRandomArray(
    locale(languageCode).videos.wantWatchMore
  )()}`;
  const watchMoreKeyBoard = keyboards.watchMoreKeyBoard(
    locale(languageCode).videos.watchMore,
    keyword,
    nowPage
  );
  const options = inlineKeyboardOptions(watchMoreKeyBoard);

  return { text, options };
};

const getSearchKeywordsKeyboardSettings = (languageCode, keywords) => {
  const text = locale(languageCode).try;

  const searchKeywordsKeyBoard = keyboards.searchKeywordsKeyBoard(keywords);
  const options = inlineKeyboardOptions(searchKeywordsKeyBoard);

  return { text, options };
};

const getRandomVideoKeyboardSettings = async (languageCode, result, type) => {
  const randomVideoKeyboard = await keyboards.randomVideoKeyboard(
    languageCode,
    result.videos,
    type
  );

  const options = {
    ...inlineKeyboardOptions(randomVideoKeyboard),
    caption: generateVideoMessageText(languageCode, result),
  };

  return {
    imageUrl: result.img_url
      ? result.img_url
      : 'https://i.imgur.com/H8BeuET.jpg',
    options,
  };
};

export {
  getLanguageKeyboardSettings,
  getDisclaimerKeyboardSettings,
  getMainMenuKeyboardSettings,
  getContactUsKeyboardSettings,
  getSettingKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getSearchVideoKeyboardSettings,
  getWatchMoreKeyboardSettings,
  getSearchKeywordsKeyboardSettings,
  getRandomVideoKeyboardSettings,
};
