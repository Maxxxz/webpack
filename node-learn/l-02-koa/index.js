const koa = require('koa');

const app = new koa();

app.use((ctx, next) => {
    console.log('url', ctx.url);
    console.log('a0')
    ctx.body = {
        data: 1,
    };
    // 没有next就不会继续执行下一个use,因为next就是下一个use注册的fn。
    // await next();
    console.log('a1')
});

// app.use('/', (ctx, next) => {
//     // console.log('url', ctx.url);
//     console.log('url')
// });

app.use((ctx, next) => {
    // console.log('url', ctx.url);
    console.log('b0')
});

app.use((ctx, next) => {
    console.log('c0')
});

app.listen(3000);



async function fn1(next){
    console.log('fn1')
    await next();
    console.log('fn1 end')
}

async function fn2(next){
    console.log('fn2')
    await next();
    console.log('fn2 end')
}
async function fn3(next){
    console.log('fn3')
    await next();
    console.log('fn3 end')
}
// KOA 中，中间件的实行原理就是通过compose去实现的，
// 在用use的时候把fn存到数组中
// liSTEN的时候，执行第一个use，后面的就会一次执行！
// 设计模式：责任链模式
function compose(middlewares){
    return function(){
        function dispatch(i){
            let fn = middlewares[i]
            if(!fn){
                return Promise.resolve()
            }
            return Promise.resolve(fn(function next(){
                return dispatch(i+1)
            }))
        }
    
        return dispatch(0)
    }
}

const test  = compose([fn1, fn2, fn3])

test()

