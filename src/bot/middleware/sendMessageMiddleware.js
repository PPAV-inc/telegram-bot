import { TelegramHandlerBuilder } from 'toolbot-core-experiment';
import sleep from 'sleep-promise';
import { sendLogOutgoing } from '../../dashbot';
import * as users from '../../models/users';

const snedMessageMiddleware = (outerContext, next) =>
  new TelegramHandlerBuilder()
    .onUnhandled(async context => {
      context.sendChatAction('typing');
      context.sendMessageContent = []; // eslint-disable-line no-param-reassign

      const message =
        context.event._rawEvent.message || context.event.callbackQuery;
      const userId = message.from.id;

      let user = await users.getUser(userId);
      if (!user) {
        user = await users.createUser(message);
      }

      context.user = user; // eslint-disable-line

      await next();

      /* eslint-disable */
      for (let i = 0; i < context.sendMessageContent.length; i += 1) {
        const { text, options } = context.sendMessageContent[i];
        await context.sendMessage(text, options);
        sendLogOutgoing(context.event._rawEvent, text, options);
        await sleep(500);
      }
      /* eslint-enable */
    })
    .build()(outerContext);

export default snedMessageMiddleware;
