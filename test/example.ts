import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import koaSwagger from '../lib';

const app = new Koa();
const router = new KoaRouter();

app.use(koaSwagger());
export default app;

router.get('/moredocs', koaSwagger({ routePrefix: false }));

app
  .use(router.routes())
  .use(router.allowedMethods());

// istanbul ignore next
if (!module.parent) {
  app.listen(3000);
  console.log('listening on: http://localhost:3000/docs');
}
