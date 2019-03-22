//实例下面的api

//buf.length
const buf = Buffer.from('This is a test!'); //from 的话，字节多少，长度就是多少
console.log(buf.length); // 15

const buf2 = Buffer.allocUnsafe(16); //直接用alloc 会自动填充
buf2[0] = 2;
console.log(buf2.length); //16

console.log(buf.toString()); //默认是utf-8
console.log(buf.toString('base64')); //可以转格式

const buf3 = Buffer.allocUnsafe(10);
console.log(buf3);
console.log(buf3.fill(7, 2, 3));

const buf4 = Buffer.from('test');
const buf5 = Buffer.from('test');
const buf6 = Buffer.from('test!');

console.log(buf4.equals(buf5));
console.log(buf4.equals(buf6));

console.log(buf4.indexOf('es'));
console.log(buf4.indexOf('as'));
