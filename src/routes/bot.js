import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';

import bot from '../bot/';

let dashbot = {
  sendLogIncoming: () => {},
};
let botimize = {
  logIncoming: () => {},
};
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  dashbot = require('../dashbot');
  // eslint-disable-next-line global-require
  botimize = require('../botimize').default;
}

const { botToken } = require(path.resolve(__dirname, '../../env/bot.config'));

const botRouter = new Router();
botRouter.use(bodyParser());

const requestHandler = bot.createRequestHandler();

botRouter.post(`/bot${botToken}`, async ({ request, response }) => {
  dashbot.sendLogIncoming(request.body);
  botimize.logIncoming(request.body);
  await requestHandler(request.body);
  response.status = 200;
});

module.exports = botRouter;
module.exports.requestHandler = requestHandler;
