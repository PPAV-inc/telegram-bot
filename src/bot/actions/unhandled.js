import uniqueRandomArray from 'unique-random-array';
import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';

const unhandled = async context => {
  const { user } = context;
  const messageContent = getMainMenuKeyboardSettings(user.languageCode);

  context.sendMessageContent.push(
    {
      text: `${uniqueRandomArray(
        locale(user.languageCode).unhandled.minor
      )()}\n${locale(user.languageCode).unhandled.main}`,
      options: {
        parse_mode: 'Markdown',
      },
    },
    messageContent
  );
};

export default unhandled;
