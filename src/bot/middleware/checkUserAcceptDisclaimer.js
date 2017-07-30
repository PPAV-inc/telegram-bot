import bot from '../telegramBot';
import * as users from '../../models/users';
import { getDisclaimerKeyboardSettings } from '../utils/getKeyboardSettings';
import locale from '../locale';

const checkUserAcceptDisclaimer = next => async (message, match = []) => {
  const response = {};
  const { from: { id: userId }, chat: { id: chatId } } = message;

  response.mssage = message;
  response.chatId = chatId;
  response.userId = userId;
  response.match = match;
  response.user = await users.getUser(userId);

  const { acceptDisclaimer, languageCode } = response.user;

  if (!acceptDisclaimer) {
    await bot.sendMessage(chatId, locale(languageCode).disclaimer, {
      parse_mode: 'Markdown',
    });

    const { text, options } = getDisclaimerKeyboardSettings(languageCode);
    await bot.sendMessage(chatId, text, options);
  } else {
    next(response);
  }
};

export default checkUserAcceptDisclaimer;
