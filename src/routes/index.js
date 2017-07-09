import Router from 'koa-router';

const indexRouter = new Router();

indexRouter.get('/', ctx => {
  const res = ctx.response;
  res.body = 'server works';
});

export default indexRouter;
