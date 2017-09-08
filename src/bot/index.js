import { MiddlewareHandlerBuilder } from 'toolbot-core-experiment';

import bot from './telegramBot';

import startHandlerMiddleware from './middleware/startHandlerMiddleware';
import mainHandlerMiddleware from './middleware/mainHandlerMiddleware';
import sendMessageMiddleware from './middleware/sendMessageMiddleware';

const middlewareHandlerBuilder = new MiddlewareHandlerBuilder()
  .use(sendMessageMiddleware)
  .use(startHandlerMiddleware)
  .use(mainHandlerMiddleware);

bot.onEvent(middlewareHandlerBuilder.build());

export default bot;
