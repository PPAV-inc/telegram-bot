import { getDisclaimerKeyboarSettings } from './getKeyboardSettings';
import locale from '../locale';

const checkUserAcceptDisclaimer = async (user, chatId, bot) => {
  const { acceptDisclaimer, languageCode } = user;

  if (acceptDisclaimer) {
    return true;
  }

  await bot.sendMessage(chatId, locale(languageCode).disclaimer, {
    parse_mode: 'Markdown',
  });

  const { text, options } = getDisclaimerKeyboarSettings(languageCode);
  await bot.sendMessage(chatId, text, options);

  return false;
};

export default checkUserAcceptDisclaimer;
