import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';

import botimize from '../botimize';
import bot from '../bot/';

const { botToken } = require(path.resolve(__dirname, '../../env/bot.config'));

const botRouter = new Router();
botRouter.use(bodyParser());

const requestHandler = bot.createRequestHandler();

botRouter.post(`/bot${botToken}`, async ({ request, response }) => {
  if (process.env.NODE_ENV === 'production') {
    botimize.logIncoming(request.body);
  }
  await requestHandler(request.body);
  response.status = 200;
});

module.exports = botRouter;
module.exports.requestHandler = requestHandler;
