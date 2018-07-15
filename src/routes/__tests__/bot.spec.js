import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import path from 'path';

const { botToken } = require(path.resolve(
  __dirname,
  '../../../env/bot.config'
));

jest.mock('../../bot/', () => ({
  createRequestHandler: jest.fn(() => jest.fn(() => Promise.resolve())),
}));
jest.mock('../../dashbot', () => ({
  sendLogIncoming: jest.fn(),
}));

function makeApp() {
  const app = new Koa();
  app.use(bodyParser());
  return app;
}

describe('bot router', () => {
  const reqBody = {
    update_id: 1,
    message: {
      message_id: 1,
      from: {
        id: 123,
        first_name: 'first_name',
        last_name: 'last_name',
        username: 'username',
        language_code: 'en-TW',
      },
      chat: {
        id: 321,
        first_name: 'first_name',
        last_name: 'last_name',
        username: 'username',
        type: 'private',
      },
      date: 1501779605,
      text: '111',
    },
  };
  let app;
  let botRouter;
  let requestHandler;
  let dashbot;

  beforeEach(() => {
    /* eslint-disable global-require */
    botRouter = require('../bot');
    ({ requestHandler, dashbot } = require('../bot'));
    /* eslint-enable */

    app = makeApp();
    app.use(botRouter.routes());
    app.use(botRouter.allowedMethods());
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should be defined', () => {
    expect(botRouter).toBeDefined();
  });

  it("should return status 200 if post '/bot{botToken}'", async () => {
    const response = await request(app.listen())
      .post(`/bot${botToken}`)
      .send(reqBody);

    expect(requestHandler).toBeCalledWith(reqBody);
    expect(response.status).toBe(200);
  });

  it('should return status 404 if post wrong url', async () => {
    const response = await request(app.listen())
      .post(`/bot`)
      .send(reqBody);

    expect(response.status).toBe(404);
  });

  it('should call dashbot', async () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';

    /* eslint-disable global-require */
    botRouter = require('../bot');
    ({ dashbot } = require('../bot'));
    /* eslint-enable */

    app = makeApp();
    app.use(botRouter.routes());
    app.use(botRouter.allowedMethods());

    await request(app.listen())
      .post(`/bot${botToken}`)
      .send(reqBody);

    expect(dashbot.sendLogIncoming).toBeCalledWith(reqBody);
  });

  it('should catch Error', async () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';

    /* eslint-disable global-require */
    botRouter = require('../bot');
    ({ dashbot } = require('../bot'));
    /* eslint-enable */

    app = makeApp();
    app.use(botRouter.routes());
    app.use(botRouter.allowedMethods());

    console.error = jest.fn();
    dashbot.sendLogIncoming.mockImplementationOnce(() => {
      throw new Error('dashbot error');
    });

    await request(app.listen())
      .post(`/bot${botToken}`)
      .send(reqBody);

    expect(dashbot.sendLogIncoming).toBeCalledWith(reqBody);
    expect(console.error).toBeCalledWith(new Error('dashbot error'));
  });
});
