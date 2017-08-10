import { createServer } from 'toolbot-core-experiment/koa';
import logger from 'koa-logger';
import compress from 'koa-compress';
import zlib from 'zlib';

import indexRouter from './src/routes/index';
import botRouter from './src/routes/bot';
import bot from './src/bot/';

const config = require(`./env/${process.env.NODE_ENV || 'development'}`);
const { botToken } = require('./env/bot.config');

const app = createServer(bot, {
  accessToken: botToken,
});

const useRouter = (application, router) => {
  application.use(router.routes());
};

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

useRouter(app, indexRouter);
useRouter(app, botRouter);

app.listen(config.port, () => {
  if (config.env !== 'production') {
    console.log(`App is running on port ${config.port} !`); // eslint-disable-line no-console
  }
});
