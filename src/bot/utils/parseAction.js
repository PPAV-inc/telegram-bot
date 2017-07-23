import {
  getLanguageKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
} from './getKeyboardSettings';

const parseAction = (action, languageCode = 'zh-TW') => {
  switch (action) {
    case 'changLanguage':
      return getLanguageKeyboardSettings();
    case 'autoDeleteMessages':
      return getAutoDeleteMessagesKeyboardSettings(languageCode);
    default:
      return undefined;
  }
};

export default parseAction;
