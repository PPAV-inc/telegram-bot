const languageKeyboard = [[{ text: '🇹🇼' }, { text: '🇺🇲' }]];

const disclaimerKeyboard = (accept, refuse) => [
  [{ text: `${accept}` }, { text: `${refuse}` }],
];

const mainMenuKeyboard = (
  about,
  checkDisclaimer,
  reportQuestion,
  contactUs,
  setting
) => [
  [{ text: `${about}` }, { text: `${reportQuestion}` }],
  [{ text: `${checkDisclaimer}` }, { text: `${contactUs}` }],
  [{ text: `${setting}` }],
];

export { languageKeyboard, disclaimerKeyboard, mainMenuKeyboard };
