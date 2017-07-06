const http = require('http');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const logger = require('koa-logger');

const config = require(`./env/${process.env.NODE_ENV || 'development'}`);

const app = new Koa();
const port = config.port;
const router = new Router();

app
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods());

if (config.logger) {
  app.use(logger());
}


http.createServer(app.callback())
  .listen(port, () => {
    if (config.env !== 'production') {
      console.log(`App listening on port ${port} !`);
    }
  });
