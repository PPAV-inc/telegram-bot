import uniqueRandomArray from 'unique-random-array';

import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';
import * as users from '../../models/users';

const acceptDisclaimer = async context => {
  const message = context.event._rawEvent.message;
  const { from: { id: userId } } = message;
  const { languageCode } = context.user;

  await users.updateUser(userId, { acceptDisclaimer: true });

  const confirmText = locale(languageCode).acceptDisclaimer.alreadyAccept;

  context.sendMessageContent.push({
    text: confirmText,
    options: { parse_mode: 'Markdown' },
  });

  context.sendMessageContent.push(
    {
      text: `${uniqueRandomArray(
        locale(languageCode).unhandled.minor
      )()}\n${locale(languageCode).unhandled.main}`,
      options: {
        parse_mode: 'Markdown',
      },
    },
    getMainMenuKeyboardSettings(languageCode)
  );
};

export default acceptDisclaimer;
