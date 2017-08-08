import * as users from '../../models/users';
import { getDisclaimerKeyboardSettings } from '../utils/getKeyboardSettings';
import locale from '../locale';

const checkUserAcceptDisclaimer = next => async context => {
  const { from: { id: userId } } = context.event.rawEvent.message;

  context.user = await users.getUser(userId); // eslint-disable-line

  const { acceptDisclaimer, languageCode } = context.user;

  if (!acceptDisclaimer) {
    await context.sendMessage(locale(languageCode).disclaimer, {
      parse_mode: 'Markdown',
    });

    const { text, options } = getDisclaimerKeyboardSettings(languageCode);
    await context.sendMessage(text, options);
  } else {
    next(context);
  }
};

export default checkUserAcceptDisclaimer;
