import getQueryResult from './getQueryResult';
import {
  getLanguageKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getVideoSourcesKeyboardSettings,
  getRadomVideoKeyboardSettings,
} from './getKeyboardSettings';

const regex = /type="(\w+)"&keyword="(.+)"&page="(\d+)"/;

const parseAction = async (action, languageCode = 'zh-TW') => {
  if (action === 'changLanguage') {
    return getLanguageKeyboardSettings();
  } else if (action === 'autoDeleteMessages') {
    return getAutoDeleteMessagesKeyboardSettings(languageCode);
  } else if (action === 'watchMore') {
    const result = await getQueryResult('PPAV');
    return getRadomVideoKeyboardSettings(languageCode, result);
  }

  const data = await regex.exec(action);
  const type = data[1];
  const keyword = data[2];
  const page = parseInt(data[3], 10);

  const { totalCount, result } = await getQueryResult(type, keyword, page);

  const { text, options } = await getVideoSourcesKeyboardSettings(
    languageCode,
    keyword,
    result,
    type,
    page,
    totalCount
  );

  return { text, options };
};

export default parseAction;
