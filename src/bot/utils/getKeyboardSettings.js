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

const generateVideoMessageText = (languageCode, result) => {
  const videoWord = locale(languageCode).videos;

  let models = '';
  result.models.forEach(modelName => {
    models += `${modelName} `;
  });

  // FIXME 等之後有 tags 跟 duration 時再用
  // let tags = '';
  // result.tags.forEach(tagName => {
  //   tags += `${tagName} `;
  // });

  // return `
  //   ${videoWord.code}: *${result.code}*\n${videoWord.title}: *${result.title}*\n${videoWord.model}: *${models}*\n${videoWord.tag}: *${tags}*\n${videoWord.duration}: *${result.duration}* ${videoWord.minute}\n${videoWord.image}: ${result.img_url}
  // `;
  return `
    ${videoWord.code}: *${result.code}*\n${videoWord.title}: *${result.title}*\n${videoWord.model}: *${models}*\n${videoWord.image}:\n${result.img_url}
  `;
};

const getVideoSourcesKeyboardSettings = async (
  languageCode,
  keyword,
  result,
  type,
  nowPage,
  totalCount
) => {
  const text = generateVideoMessageText(languageCode, result);

  const videoSourcesKeyboard = await keyboards.videoSourcesKeyboard(
    keyword,
    result.videos,
    type,
    nowPage,
    totalCount
  );
  const options = inlineKeyboardOptions(videoSourcesKeyboard);

  return { text, options };
};

const getRadomVideoKeyboardSettings = async (languageCode, result) => {
  const text = generateVideoMessageText(languageCode, result);
  const radomVideoKeyboard = await keyboards.radomVideoKeyboard(
    locale(languageCode).videos.watchMore,
    result
  );
  const options = inlineKeyboardOptions(radomVideoKeyboard);

  return { text, options };
};

const getImageAnalyticKeyboardSettings = async (languageCode, result) => {
  const photos = [];
  for (let i = 0; i < result.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const imageAnalyticKeyboard = await keyboards.imageAnalyticKeyboard(
      result[i]
    );
    photos.push({
      text: generateVideoMessageText(languageCode, result[i]),
      options: inlineKeyboardOptions(imageAnalyticKeyboard),
    });
  }

  return photos;
};

export {
  getLanguageKeyboardSettings,
  getDisclaimerKeyboardSettings,
  getMainMenuKeyboardSettings,
  getContactUsKeyboardSettings,
  getSettingKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getVideoSourcesKeyboardSettings,
  getRadomVideoKeyboardSettings,
  getImageAnalyticKeyboardSettings,
};
