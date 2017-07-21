import getQueryResult from './getQueryResult';
import {
  getLanguageKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getVideoSourcesKeyboardSettings,
} from './getKeyboardSettings';

const regex = /type="(\w+)"&query="(.+)"&page="(\d+)"/;

const parseAction = async (action, languageCode = 'zh-TW') => {
  if (action === 'changLanguage') {
    return getLanguageKeyboardSettings();
  } else if (action === 'autoDeleteMessages') {
    return getAutoDeleteMessagesKeyboardSettings(languageCode);
  }

  const data = await regex.exec(action);
  const type = data[1];
  const query = data[2];
  const page = parseInt(data[3], 10);

  const video = await getQueryResult(type, query, page);

  const { text, options } = await getVideoSourcesKeyboardSettings(
    languageCode,
    query,
    video,
    type,
    page
  );

  return { text, options };
};

export default parseAction;
