import locale from '../locale';
import * as users from '../../models/users';

const subscribe = async context => {
  const message = context.event._rawEvent.message;
  const match = /(gginin|nogg|Gginin|Nogg)\s*(\d*)$/i.exec(message.text);
  const { from: { id: userId } } = message;
  const { languageCode, subscribe: subscribeStatus } = context.user;
  const wantSubscribe = match[1] === 'gginin' || match[1] === 'Gginin';
  const subscribeHour = match[2] !== '' ? +match[2] : -1;

  if (wantSubscribe && subscribeHour >= 0 && subscribeHour <= 23) {
    await users.updateUser(userId, { subscribe: true, subscribeHour });

    context.sendMessageContent.push({
      text: locale(languageCode).subscribe.success(subscribeHour),
      options: { parse_mode: 'Markdown' },
    });
  } else if (!wantSubscribe) {
    await users.updateUser(userId, { subscribe: false, subscribeHour });

    context.sendMessageContent.push({
      text:
        subscribeStatus === false
          ? locale(languageCode).subscribe.alreadyUnsubscribe
          : locale(languageCode).subscribe.unsubscribe,
      options: { parse_mode: 'Markdown' },
    });
  } else {
    context.sendMessageContent.push({
      text: locale(languageCode).subscribe.failed,
      options: { parse_mode: 'Markdown' },
    });
  }
};

export default subscribe;
