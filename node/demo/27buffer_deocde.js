const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const buf = Buffer.from('中文字符串！');

for (let i = 0; i < buf.length; i += 5) {
  //中文字符占用3个字节，所以所以每5个做区分，就会出问题
  const b = Buffer.allocUnsafe(5);
  buf.copy(b, 0, i);
  // console.log(b.toString());
  console.log(decoder.write(b));
}
