import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';

const unhandled = async context => {
  const { user } = context;
  context.sendMessageContent.push({
    text: locale(user.languageCode).unhandled,
    options: {
      parse_mode: 'Markdown',
    },
  });

  const { text, options } = getMainMenuKeyboardSettings(user.languageCode);

  context.sendMessageContent.push({
    text,
    options,
  });
};

export default unhandled;
