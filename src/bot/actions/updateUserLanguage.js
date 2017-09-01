import locale from '../locale';
import { updateUser } from '../../models/users';
import userAuthenticatedMiddleware from '../middleware/userAuthenticatedMiddleware';

const updateUserLanguage = async (context, next) => {
  const { from: { id: userId }, text } = context.event._rawEvent.message;
  const languageCode = text === '繁體中文' ? 'zh-TW' : 'en';

  await updateUser(userId, { languageCode });

  context.sendMessageContent.push({
    text: locale(languageCode).updateUserLanguage,
    options: { parse_mode: 'Markdown' },
  });
  context.user.languageCode = languageCode; // eslint-disable-line no-param-reassign

  await userAuthenticatedMiddleware(context, next);
};

export default updateUserLanguage;
