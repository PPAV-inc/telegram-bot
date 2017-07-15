import { getLanguageKeyboarSettings } from './getKeyboardSettings';

const parseAction = action => {
  switch (action) {
    case 'changLanguage':
      return getLanguageKeyboarSettings();
    default:
      return undefined;
  }
};

export default parseAction;
