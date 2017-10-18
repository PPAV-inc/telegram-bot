import locale from '../locale';

const paidWebsites = ['iavtv'];

const languageKeyboard = [[{ text: '繁體中文' }, { text: 'English' }]];

const disclaimerKeyboard = (disclaimer, accept) => [
  [{ text: `${accept}` }],
  [{ text: `${disclaimer}` }],
];

const mainMenuKeyboard = (
  randomVideo,
  tutorial,
  about,
  checkDisclaimer,
  report,
  contactUs,
  setting
) => [
  [{ text: `${randomVideo}` }, { text: `${tutorial}` }],
  [{ text: `${about}` }, { text: `${report}` }],
  [{ text: `${checkDisclaimer}` }, { text: `${contactUs}` }],
  [{ text: `${setting}` }],
];

const contactUsKeyboard = (text, url) => [[{ text, url }]];

const autoDeleteMessagesKeyboard = (active, inactive) => [
  [{ text: `${active}` }, { text: `${inactive}` }],
];

const settingKeyboard = buttons => {
  const keyboard = [];

  /* eslint-disable */
  for (const prop in buttons) {
    const button = [{ text: buttons[prop], callback_data: prop }];
    keyboard.push(button);
  }
  /* eslint-enable */

  return keyboard;
};

const searchVideoKeyboard = (languageCode, videos) => {
  const keyboard = [];
  const { paid } = locale(languageCode).videos;

  for (let i = 0; i < videos.length; i += 1) {
    const { source, view_count: viewCount } = videos[i];
    const text = `${paidWebsites.indexOf(source) > -1
      ? paid
      : ''}🔞 ${source}   👁 ${viewCount || 0}`;
    keyboard.push([
      {
        text,
        url: videos[i].url,
      },
    ]);
  }

  return keyboard;
};

const watchMoreKeyBoard = async (text, keyword, nowPage) => {
  const keyboard = [
    [{ text, callback_data: `keyword="${keyword}"&page="${nowPage + 5}"` }],
  ];

  return keyboard;
};

const randomVideoKeyboard = (languageCode, videos) => {
  const keyboard = [];
  const { watchMore, paid } = locale(languageCode).videos;

  for (let i = 0; i < videos.length; i += 1) {
    const { source, view_count: viewCount } = videos[i];
    const text = `${paidWebsites.indexOf(source) > -1
      ? paid
      : ''}🔞 ${source}   👁 ${viewCount || 0}`;
    keyboard.push([
      {
        text,
        url: videos[i].url,
      },
    ]);
  }

  keyboard.push([{ text: watchMore, callback_data: 'watchMore' }]);

  return keyboard;
};

const imageAnalyticKeyboard = result => {
  const keyboard = [];

  for (let i = 0; i < result.videos.length; i += 1) {
    keyboard.push([
      {
        text: `🔞 ${result.videos[i].source}   👁 ${result.videos[i]
          .view_count || 0}`,
        url: result.videos[i].url,
      },
    ]);
  }
  return keyboard;
};

export {
  languageKeyboard,
  disclaimerKeyboard,
  mainMenuKeyboard,
  contactUsKeyboard,
  settingKeyboard,
  autoDeleteMessagesKeyboard,
  searchVideoKeyboard,
  watchMoreKeyBoard,
  randomVideoKeyboard,
  imageAnalyticKeyboard,
};
