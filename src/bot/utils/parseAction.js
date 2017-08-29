import getQueryResult from './getQueryResult';
import {
  getLanguageKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getVideoSourcesKeyboardSettings,
  getRandomVideoKeyboardSettings,
} from './getKeyboardSettings';

const regex = /keyword="(.+)"&page="(\d+)"/;

const parseAction = async (action, languageCode = 'zh-TW') => {
  if (action === 'changLanguage') {
    return getLanguageKeyboardSettings();
  } else if (action === 'autoDeleteMessages') {
    return getAutoDeleteMessagesKeyboardSettings(languageCode);
  } else if (action === 'watchMore') {
    const result = await getQueryResult('PPAV');
    return getRandomVideoKeyboardSettings(languageCode, result);
  }

  const data = await regex.exec(action);
  const keyword = data[1];
  const page = parseInt(data[2], 10);

  const { totalCount, result } = await getQueryResult('search', keyword, page);

  const { text, options } = await getVideoSourcesKeyboardSettings(
    languageCode,
    keyword,
    result,
    page,
    totalCount
  );

  return { text, options };
};

export default parseAction;
