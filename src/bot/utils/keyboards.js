import locale from '../locale';

const paidWebsites = ['iavtv'];

const languageKeyboard = [[{ text: '繁體中文' }, { text: 'English' }]];

const disclaimerKeyboard = (disclaimer, accept) => [
  [{ text: `${accept}` }],
  [{ text: `${disclaimer}` }],
];

const mainMenuKeyboard = (
  ourshd,
  randomVideo,
  hotVideo,
  tutorial,
  about,
  report,
  checkDisclaimer,
  setting
) => [
  [{ text: ourshd }],
  [{ text: randomVideo }, { text: hotVideo }],
  [{ text: tutorial }, { text: about }],
  [{ text: report }, { text: checkDisclaimer }],
  [{ text: setting }],
];

const contactUsKeyboard = (text, url) => [[{ text, url }]];

const autoDeleteMessagesKeyboard = (active, inactive) => [
  [{ text: `${active}` }, { text: `${inactive}` }],
];

const settingKeyboard = (buttons) => {
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
  const { paid } = locale(languageCode).videos;

  const keyboard = videos.map((video) => {
    const { source, view_count: viewCount, url } = video;
    const text = `${
      paidWebsites.includes(source) ? paid : ''
    }🔞 ${source}   👁 ${viewCount || 0}`;

    return [
      {
        text,
        url,
      },
    ];
  });

  return keyboard;
};

const watchMoreKeyBoard = (text, keyword, nowPage) => {
  const keyboard = [
    [{ text, callback_data: `keyword="${keyword}"&page="${nowPage + 5}"` }],
  ];

  return keyboard;
};

const searchKeywordsKeyBoard = (keywords) => {
  const keyboard = keywords.map((keyword) => [
    {
      text: `${keyword}`,
      callback_data: `keyword="${keyword}"&page="0"`,
    },
  ]);

  return keyboard;
};

const randomVideoKeyboard = (languageCode, videos, type) => {
  const { watchMore, paid } = locale(languageCode).videos;

  const keyboard = videos.map((video) => {
    const { source, view_count: viewCount, url } = video;
    const text = `${
      paidWebsites.includes(source) ? paid : ''
    }🔞 ${source}   👁 ${viewCount || 0}`;

    return [
      {
        text,
        url,
      },
    ];
  });

  keyboard.push([
    {
      text: watchMore,
      callback_data: type === 'hot' ? 'watchMoreHot' : 'watchMoreNew',
    },
  ]);

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
  searchKeywordsKeyBoard,
  randomVideoKeyboard,
};
