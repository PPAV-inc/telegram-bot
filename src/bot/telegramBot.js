import { TelegramBot } from 'toolbot-core-experiment';

import path from 'path';

const { botToken, url } = require(path.resolve(
  __dirname,
  '../../env/bot.config'
));

const bot = new TelegramBot({
  accessToken: botToken,
});

bot.connector.client.setWebhook(`${url}/bot${botToken}`);

export default bot;
