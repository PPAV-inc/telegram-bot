import { createServer } from 'toolbot-core-experiment/koa';
import logger from 'koa-logger';
import compress from 'koa-compress';
import zlib from 'zlib';

import bot from './src/bot/';

const config = require(`./env/${process.env.NODE_ENV || 'development'}`);
const { botToken } = require('./env/bot.config');

const app = createServer(bot, {
  accessToken: botToken,
});

app.use(
  compress({
    filter: contentType => /text/i.test(contentType),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH,
  })
);

if (config.logger) {
  app.use(logger());
}

app.listen(config.port, () => {
  if (config.env !== 'production') {
    console.log(`App is running on port ${config.port} !`); // eslint-disable-line no-console
  }
});
