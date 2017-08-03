import Router from 'koa-router';

import bot from '../bot';
import config from '../../env/bot.config';

const { botToken } = config;
const botRouter = new Router();

botRouter.post(`/bot${botToken}`, ctx => {
  const res = ctx.response;
  const req = ctx.request;

  bot.processUpdate(req.body);

  res.status = 200;
});

export default botRouter;
