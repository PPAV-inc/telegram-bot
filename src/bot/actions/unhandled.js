import uniqueRandomArray from 'unique-random-array';
import locale from '../locale';
import {
  getMainMenuKeyboardSettings,
  getSearchKeywordsKeyboardSettings,
} from '../utils/getKeyboardSettings';
import { getSearchKeywords } from '../../models/searchKeywords';

const unhandled = async (context) => {
  const { user } = context;

  const keywords = await getSearchKeywords();

  const messageContent = getMainMenuKeyboardSettings(user.languageCode);
  const searchKeywordsContent = getSearchKeywordsKeyboardSettings(
    user.languageCode,
    keywords
  );

  context.sendMessageContent.push(
    {
      text: `${uniqueRandomArray(
        locale(user.languageCode).unhandled.minor
      )()}\n${locale(user.languageCode).unhandled.main}`,
      options: {
        parse_mode: 'Markdown',
      },
    },
    messageContent,
    searchKeywordsContent
  );
};

export default unhandled;
