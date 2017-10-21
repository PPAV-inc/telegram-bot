import path from 'path';

import { TelegramBot, middleware } from 'bottender';
import startHandlerMiddleware from './middleware/startHandlerMiddleware';
import mainHandlerMiddleware from './middleware/mainHandlerMiddleware';
import sendMessageMiddleware from './middleware/sendMessageMiddleware';

const { botToken, url } = require(path.resolve(
  __dirname,
  '../../env/bot.config'
));

const bot = new TelegramBot({
  accessToken: botToken,
});

bot.connector.client.setWebhook(`${url}/bot${botToken}`);

bot.onEvent(
  middleware([
    sendMessageMiddleware,
    startHandlerMiddleware,
    mainHandlerMiddleware,
  ])
);

export default bot;
