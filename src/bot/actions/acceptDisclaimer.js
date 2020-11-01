import uniqueRandomArray from 'unique-random-array';

import locale from '../locale';
import {
  getMainMenuKeyboardSettings,
  getSearchKeywordsKeyboardSettings,
} from '../utils/getKeyboardSettings';
import * as users from '../../models/users';
import { getSearchKeywords } from '../../models/searchKeywords';

const acceptDisclaimer = async (context) => {
  const { message } = context.event._rawEvent;
  const {
    from: { id: userId },
  } = message;
  const { languageCode } = context.user;

  await users.updateUser(userId, { acceptDisclaimer: true });
  const keywords = await getSearchKeywords();

  const confirmText = locale(languageCode).acceptDisclaimer.alreadyAccept;
  const searchKeywordsContent = getSearchKeywordsKeyboardSettings(
    languageCode,
    keywords
  );
  context.sendMessageContent.push(
    {
      text: confirmText,
      options: { parse_mode: 'Markdown' },
    },
    {
      text: `${uniqueRandomArray(locale(languageCode).unhandled.minor)()}\n${
        locale(languageCode).unhandled.main
      }`,
      options: {
        parse_mode: 'Markdown',
      },
    },
    getMainMenuKeyboardSettings(languageCode),
    searchKeywordsContent
  );
};

export default acceptDisclaimer;
