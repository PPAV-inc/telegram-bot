import locale from '../locale';
import { getMainMenuKeyboardSettings } from '../utils/getKeyboardSettings';
import * as users from '../../models/users';

const checkAcceptDisclaimer = async context => {
  const message = context.event._rawEvent.message;
  const match = /(接受|Accept) ✅$|(不接受|Refuse) ❌$/i.exec(message.text);
  const { from: { id: userId } } = message;
  const accept = match[0].indexOf('✅') > 0;
  const { languageCode } = await users.getUser(userId);

  await users.updateUser(userId, { acceptDisclaimer: accept });

  const confirmText = accept
    ? locale(languageCode).acceptDisclaimer.alreadyAccept
    : locale(languageCode).acceptDisclaimer.alreadyRefuse;

  context.sendMessageContent.push({
    text: confirmText,
    options: { parse_mode: 'Markdown' },
  });

  if (accept) {
    const { text, options } = getMainMenuKeyboardSettings(languageCode);
    context.sendMessageContent.push({
      text,
      options,
    });
  }
};

export default checkAcceptDisclaimer;
