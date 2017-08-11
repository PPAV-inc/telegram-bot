import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest-as-promised';
import path from 'path';

const config = require(path.resolve(__dirname, '../../../env/bot.config'));

jest.mock('../../bot/', () => ({
  createRequestHandler: jest.fn(() => () => Promise.resolve()),
}));

const botRouter = require('../bot');

const { botToken } = config;

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

  beforeEach(() => {
    app = makeApp();
    app.use(botRouter.routes());
    app.use(botRouter.allowedMethods());
  });

  it('should be defined', () => {
    expect(botRouter).toBeDefined();
  });

  it("should return status 200 if post '/bot{botToken}'", async () => {
    const response = await request(app.listen())
      .post(`/bot${botToken}`)
      .send(reqBody);

    expect(response.status).toBe(200);
  });

  it('should return status 404 if post wrong url', async () => {
    const response = await request(app.listen()).post(`/bot`).send(reqBody);

    expect(response.status).toBe(404);
  });
});
