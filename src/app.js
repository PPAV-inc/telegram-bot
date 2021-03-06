import { createServer } from 'bottender/koa';
import logger from 'koa-logger';
import compress from 'koa-compress';
import zlib from 'zlib';

import indexRouter from './routes/index';
import botRouter from './routes/bot';
import bot from './bot';

const botToken = process.env.BOT_TOKEN;

const app = createServer(bot, {
  accessToken: botToken,
});

const useRouter = (application, router) => {
  application.use(router.routes());
};

app.use(
  compress({
    filter: (contentType) => /text/i.test(contentType),
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH,
  })
);

if (process.env.LOGGER) {
  app.use(logger());
}

useRouter(app, indexRouter);
useRouter(app, botRouter);

export default app;
