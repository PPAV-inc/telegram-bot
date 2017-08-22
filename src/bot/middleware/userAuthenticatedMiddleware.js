import { getDisclaimerKeyboardSettings } from '../utils/getKeyboardSettings';
import locale from '../locale';

const userAuthenticatedMiddleware = async (context, next) => {
  const { acceptDisclaimer, languageCode } = context.user;

  if (!acceptDisclaimer) {
    context.sendMessageContent.push({
      text: locale(languageCode).disclaimer,
      options: {
        parse_mode: 'Markdown',
      },
    });

    const { text, options } = getDisclaimerKeyboardSettings(languageCode);

    context.sendMessageContent.push({
      text,
      options,
    });
  } else {
    await next(context);
  }
};

export default userAuthenticatedMiddleware;
