// eslint-disable-next-line no-undef
var Koa = require('koa');
var app = new Koa();

var mid1 = async (ctx, next) => {
  ctx.body = 'k';
  console.log('1');
  await next();
  console.log('4');
};

var mid2 = async (ctx, next) => {
  ctx.body = 'k+1';
  console.log('2');
  await next();
  console.log('3');
};

app.use(mid1);
app.use(mid2);


app.listen(1234)
