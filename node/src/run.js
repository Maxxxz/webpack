var counter = require('./../util/counter');

console.log('run', counter.count());

// setImmediate(() => {
//   //等待下一个事件队列，和时间无关，所以只有一个参数
//   console.log('setImmediate');
// });

// setTimeout(() => {
//   //延时之后执行
//   console.log('setTimeout');
// }, 100);

// process.nextTick(() => {
//   //当前事件队列最后执行
//   console.log('nextTick');
//   setTimeout(() => {
//     //延时之后执行
//     console.log('setTimeout2');
//   }, 1000);
// });
