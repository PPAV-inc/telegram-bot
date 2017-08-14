import { TelegramHandlerBuilder } from 'toolbot-core-experiment';
import sleep from 'sleep-promise';
import botimize from '../../botimize';

const isProduction = process.env.NODE_ENV === 'production';

const snedMessageMiddleware = (outerContext, next) =>
  new TelegramHandlerBuilder()
    .onUnhandled(async context => {
      context.sendChatAction('typing');
      context.sendMessageContent = []; // eslint-disable-line no-param-reassign
      await next();

      /* eslint-disable */
      for (let i = 0; i < context.sendMessageContent.length; i += 1) {
        const { text, options } = context.sendMessageContent[i];
        await context.sendMessage(text, options);
        await sleep(500);

        if (isProduction) {
          botimize.sendOutgoingLog(
            context.event._rawEvent.message.chat.id,
            text
          );
        }
      }
      /* eslint-enable */
    })
    .build()(outerContext);

export default snedMessageMiddleware;
