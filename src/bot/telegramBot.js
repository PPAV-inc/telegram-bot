import { TelegramBot } from 'toolbot-core-experiment';

import path from 'path';

const { botToken, url } = require(path.resolve(
  __dirname,
  '../../env/bot.config'
));

const bot = new TelegramBot({
  accessToken: botToken,
});

bot.connector._client.setWebhook(url);

export default bot;
