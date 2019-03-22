/* console.log(Buffer.alloc(10));
console.log(Buffer.allocUnsafe(10));
console.log(Buffer.alloc(5, 1));
console.log(Buffer.allocUnsafe(5, 1));
console.log(Buffer.from([1, 2, 3, 999999999111132]));
console.log(Buffer.from('test')); */

//判断字节长度
console.log(Buffer.byteLength('test'));
console.log(Buffer.byteLength('测试')); //基数

//判断是否是buffer对象
console.log(Buffer.isBuffer({}));
console.log(Buffer.isBuffer(Buffer.from([1, 2, 3])));

//连接buffer
const buf1 = Buffer.from('This');
const buf2 = Buffer.from('is');
const buf3 = Buffer.from('a');
const buf4 = Buffer.from('test');
const buf5 = Buffer.from('!');

const buf = Buffer.concat([buf1, buf2, buf3, buf4, buf5]);
console.log('buf', buf);
console.log('buf tostring', buf.toString());
