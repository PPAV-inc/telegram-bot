import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';

import bot from '../bot/';
import { sendLogIncoming } from '../dashbot';

const { botToken } = require(path.resolve(__dirname, '../../env/bot.config'));

const botRouter = new Router();
botRouter.use(bodyParser());

const requestHandler = bot.createRequestHandler();

botRouter.post(`/bot${botToken}`, async ({ request, response }) => {
  sendLogIncoming(request.body);
  await requestHandler(request.body);
  response.status = 200;
});

module.exports = botRouter;
module.exports.requestHandler = requestHandler;
