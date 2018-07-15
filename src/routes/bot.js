import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import path from 'path';

import bot from '../bot';

let dashbot = {
  sendLogIncoming: () => {},
};
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  dashbot = require('../dashbot');
}

const { botToken } = require(path.resolve(__dirname, '../../env/bot.config'));

const botRouter = new Router();
botRouter.use(bodyParser());

const requestHandler = bot.createRequestHandler();

botRouter.post(`/bot${botToken}`, async ({ request, response }) => {
  try {
    dashbot.sendLogIncoming(request.body);
  } catch (err) {
    console.error(err);
  }
  await requestHandler(request.body);
  response.status = 200;
});

module.exports = botRouter;
module.exports.requestHandler = requestHandler;
module.exports.dashbot = dashbot;
