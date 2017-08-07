import Router from 'koa-router';
import path from 'path';

import botimize from '../botimize';
import bot from '../bot';

const config = require(path.resolve(__dirname, '../../env/bot.config'));

const { botToken } = config;
const botRouter = new Router();

botRouter.post(`/bot${botToken}`, ctx => {
  const res = ctx.response;
  const req = ctx.request;

  botimize.logIncoming(req.body);
  bot.processUpdate(req.body);

  res.status = 200;
});

export default botRouter;
