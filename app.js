import http from 'http';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import compress from 'koa-compress';
import zlib from 'zlib';

import indexRouter from './src/routes/index';
import botRouter from './src/routes/bot';

const config = require(`./env/${process.env.NODE_ENV || 'development'}`);

const app = new Koa();
const port = config.port;

const useRouter = (application, router) => {
  application.use(router.routes()).use(router.allowedMethods());
};

app
  .use(
    compress({
      filter: contentType => /text/i.test(contentType),
      threshold: 2048,
      flush: zlib.Z_SYNC_FLUSH,
    })
  )
  .use(bodyparser());

if (config.logger) {
  app.use(logger());
}

useRouter(app, indexRouter);
useRouter(app, botRouter);

http.createServer(app.callback()).listen(port, () => {
  if (config.env !== 'production') {
    console.log(`App listening on port ${port} !`); // eslint-disable-line no-console
  }
});
