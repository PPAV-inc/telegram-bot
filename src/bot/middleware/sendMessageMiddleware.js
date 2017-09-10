import { TelegramHandlerBuilder } from 'toolbot-core-experiment';

import * as users from '../../models/users';

let sendLogOutgoing = () => {};
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  sendLogOutgoing = require('../../dashbot').sendLogOutgoing;
}

const sendMessageMiddleware = (outerContext, next) =>
  new TelegramHandlerBuilder()
    .onEvent(async context => {
      const message =
        context.event._rawEvent.message || context.event.callbackQuery.message;
      context.sendChatAction('typing');

      const userId = message.chat.id;
      let user = await users.getUser(userId);
      if (!user) {
        user = await users.createUser(message);
      }

      context.sendMessageContent = []; // eslint-disable-line no-param-reassign
      context.user = user; // eslint-disable-line no-param-reassign

      await next();

      /* eslint-disable */
      for (let i = 0; i < context.sendMessageContent.length; i += 1) {
        const { imageUrl, text, options } = context.sendMessageContent[i];
        if (imageUrl) {
          await context.sendPhoto(imageUrl, options);
          sendLogOutgoing(context.event._rawEvent, options.caption);
        } else {
          await context.sendMessage(text, options);
          sendLogOutgoing(context.event._rawEvent, text, options);
        }
      }
      /* eslint-enable */
    })
    .build()(outerContext);

export default sendMessageMiddleware;
