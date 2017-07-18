const languageKeyboard = [[{ text: '🇹🇼' }, { text: '🇺🇲' }]];

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

export {
  languageKeyboard,
  disclaimerKeyboard,
  mainMenuKeyboard,
  contactUsKeyboard,
  settingKeyboard,
  autoDeleteMessagesKeyboard,
};
