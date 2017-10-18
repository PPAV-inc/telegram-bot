import { getDisclaimerKeyboardSettings } from '../utils/getKeyboardSettings';

const userAuthenticatedMiddleware = async (context, next) => {
  const { acceptDisclaimer, languageCode } = context.user;

  if (!acceptDisclaimer) {
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
