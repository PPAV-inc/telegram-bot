import { TelegramBot, middleware } from 'bottender';
import startHandlerMiddleware from './middleware/startHandlerMiddleware';
import mainHandlerMiddleware from './middleware/mainHandlerMiddleware';
import sendMessageMiddleware from './middleware/sendMessageMiddleware';

const botToken = process.env.BOT_TOKEN;
const url = process.env.URL;

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
