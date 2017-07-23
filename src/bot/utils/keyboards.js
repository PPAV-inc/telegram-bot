const languageKeyboard = [[{ text: '繁體中文' }, { text: 'English' }]];

const disclaimerKeyboard = (accept, refuse) => [
  [{ text: `${accept}` }, { text: `${refuse}` }],
];

const mainMenuKeyboard = (
  about,
  checkDisclaimer,
  report,
  contactUs,
  setting
) => [
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

const videoSourcesKeyboard = async (
  keyword,
  videos,
  type,
  nowPage,
  totalPage
) => {
  const keyboard = [];

  for (let i = 0; i < videos.length; i += 1) {
    keyboard.push([
      {
        text: `🔞 ${videos[i].source}   👁 ${videos[i].view_count}`,
        url: videos[i].url,
      },
    ]);
  }

  const pageButtons = [];
  if (nowPage < 4 || totalPage < 5) {
    for (let i = 1; i <= 5 && i <= totalPage; i += 1) {
      pageButtons[i] = {
        text: `${i}`,
        callback_data: `type="${type}"&keyword="${keyword}"&page="${i}"`,
      };
    }

    pageButtons[nowPage] = {
      text: `⋆${nowPage}⋆`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${nowPage}"`,
    };

    if (totalPage > 4) {
      pageButtons[4] = {
        text: `4 >`,
        callback_data: `type="${type}"&keyword="${keyword}"&page="4"`,
      };
      pageButtons[5] = {
        text: `${totalPage} ≫`,
        callback_data: `type="${type}"&keyword="${keyword}"&page="${totalPage}"`,
      };
    }
  } else if (totalPage - nowPage > 2) {
    pageButtons[1] = {
      text: `≪ 1`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="1"`,
    };
    pageButtons[2] = {
      text: `< ${nowPage - 1}`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${nowPage -
        1}"`,
    };
    pageButtons[3] = {
      text: `⋆${nowPage}⋆`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${nowPage}"`,
    };
    pageButtons[4] = {
      text: `${nowPage + 1} >`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${nowPage +
        1}"`,
    };
    pageButtons[5] = {
      text: `${totalPage} ≫`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${totalPage}"`,
    };
  } else {
    pageButtons[1] = {
      text: `≪ 1`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="1"`,
    };
    pageButtons[2] = {
      text: `< ${totalPage - 3}`,
      callback_data: `type="${type}"&keyword="${keyword}"&page="${totalPage -
        3}"`,
    };

    let count = 3;
    for (let i = 2; i > -1; i -= 1) {
      if (nowPage === totalPage - i) {
        pageButtons[(count += 1)] = {
          text: `⋆${nowPage}⋆`,
          callback_data: `type="${type}"&keyword="${keyword}"&page="${nowPage}"`,
        };
      } else {
        pageButtons[(count += 1)] = {
          text: `${totalPage - i}`,
          callback_data: `type="${type}"&keyword="${keyword}"&page="${totalPage -
            i}"`,
        };
      }
    }
  }

  keyboard.push(pageButtons.filter(e => e));

  return keyboard;
};

const radomVideoKeyboard = (text, result) => {
  const keyboard = [];

  // FIXME
  keyboard.push([
    {
      text: `🔞 ${result.source}   👁 ${result.view_count}`,
      url: result.url,
    },
  ]);

  keyboard.push([{ text, callback_data: 'watchMore' }]);

  return keyboard;
};
export {
  languageKeyboard,
  disclaimerKeyboard,
  mainMenuKeyboard,
  contactUsKeyboard,
  settingKeyboard,
  autoDeleteMessagesKeyboard,
  videoSourcesKeyboard,
  radomVideoKeyboard,
};
