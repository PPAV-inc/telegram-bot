import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';

const unhandled = async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).unhandled, {
    parse_mode: 'Markdown',
  });
  const { text, options } = getMainMenuKeyboardSettings(user.languageCode);
  await context.sendMessage(text, options);
};

export default unhandled;
