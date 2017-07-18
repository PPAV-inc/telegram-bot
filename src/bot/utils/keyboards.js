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

const settingKeyboard = buttons => {
  const keyboard = [];
  let keyboardRow = [];
  let keyboardCount = 0;

  /* eslint-disable */
  for (const prop in buttons) {
    const button = { text: buttons[prop], callback_data: prop };
    const position = keyboardCount % 2;

    if (position === 0) {
      keyboardRow = [];
    }

    keyboardRow[position] = button;

    keyboard[Math.floor(keyboardCount / 2)] = keyboardRow;
    keyboardCount += 1;
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
};
