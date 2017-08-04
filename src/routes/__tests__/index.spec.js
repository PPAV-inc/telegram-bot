import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest-as-promised';

import indexRouter from '../';

function makeApp() {
  const app = new Koa();
  app.use(bodyParser());
  return app;
}

describe('index router', () => {
  let app;

  beforeEach(() => {
    app = makeApp();
    app.use(indexRouter.routes());
    app.use(indexRouter.allowedMethods());
  });

  it('should be defined', () => {
    expect(indexRouter).toBeDefined();
  });

  it("should return 'server works' if get '/'", async () => {
    const response = await request(app.listen()).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('server works');
  });

  it("should return status 404 if not get '/'", async () => {
    const response = await request(app.listen()).get('/QQ');

    expect(response.status).toBe(404);
  });
});
