import { MiddlewareHandlerBuilder } from 'toolbot-core-experiment';

import bot from './telegramBot';

import startHandlerMiddleware from './middleware/startHandlerMiddleware';
import mainHandlerMiddleware from './middleware/mainHandlerMiddleware';

const middlewareHandlerBuilder = new MiddlewareHandlerBuilder()
  .use(startHandlerMiddleware)
  .use(mainHandlerMiddleware);

bot.handle(middlewareHandlerBuilder.build());

export default bot;
