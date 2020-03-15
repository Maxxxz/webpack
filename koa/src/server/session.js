const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');

const app = new Koa();
app.keys = ['Hi Luke'];

app.use(logger());
app.use(session(app));

app.use(ctx => {
  if (ctx.path === '/favicon.ico') return;

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
});

app.listen(2333)
