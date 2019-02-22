// const EventEmitter = require('events').EventEmitter;

// const emitter1 = new EventEmitter();

// emitter1.on('some', info => {
//   console.log('fn1', info);
// });

// emitter1.on('some', info => {
//   console.log('fn2', info);
// });

// emitter1.emit('some', 'first emit');
// //fn1 first emit
// //fn2 first emit
// const EventEmitter = require('events').EventEmitter;
// class Dog extends EventEmitter {
//   constructor(name) {
//     super();
//     this.name = name;
//   }
// }

// const simon = new Dog('simon');
// simon.on('bark', function(info) {
//   //注意这里不能用es6的箭头函数，不然指向的就是当前的声明环境。
//   console.log(`${this.name} ${info}`);
// });

// simon.emit('bark', 'wang~'); //simon wang~
// simon.emit('bark', 'miao~');  //simon miao~

//stream 流
const fs = require('fs');
const readStream = fs.createReadStream('./data/file1.txt');
let length = 0;

readStream.on('data', function(chunk) {
  const len = chunk.toString().length;
  console.log('len', len);
  length += len;
});

readStream.on('end', function() {
  console.log('total', length);
});

/**
len 65536
...
len 65536
len 65536
len 65536
len 65535
total 77856767
 */
