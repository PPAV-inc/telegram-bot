import {
  getLanguageKeyboarSettings,
  getAutoDeleteMessagesKeyboarSettings,
} from './getKeyboardSettings';

const parseAction = (action, languageCode = 'zh-TW') => {
  switch (action) {
    case 'changLanguage':
      return getLanguageKeyboarSettings();
    case 'autoDeleteMessages':
      return getAutoDeleteMessagesKeyboarSettings(languageCode);
    default:
      return undefined;
  }
};

export default parseAction;
