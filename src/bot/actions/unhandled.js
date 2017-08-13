import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';

const unhandled = async context => {
  const { user } = context;
  const messageContent = getMainMenuKeyboardSettings(user.languageCode);

  context.sendMessageContent.push(
    {
      text: locale(user.languageCode).unhandled,
      options: {
        parse_mode: 'Markdown',
      },
    },
    messageContent
  );
};

export default unhandled;
