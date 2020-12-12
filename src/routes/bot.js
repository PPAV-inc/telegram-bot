import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import bot from '../bot';

let chatbase = {
  sendLogIncoming: () => {},
};
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  chatbase = require('../chatbase');
}

const botToken = process.env.BOT_TOKEN;

const botRouter = new Router();
botRouter.use(bodyParser());

const requestHandler = bot.createRequestHandler();

botRouter.post(`/bot${botToken}`, async ({ request, response }) => {
  try {
    chatbase.sendLogIncoming(request.body);
  } catch (err) {
    console.error(err);
  }
  await requestHandler(request.body);
  response.status = 200;
});

module.exports = botRouter;
module.exports.requestHandler = requestHandler;
