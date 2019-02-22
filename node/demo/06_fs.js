const fs = require('fs');

const result = fs.readFile('./06_fs1.js', (err, data) => {
  err && console.log('err', err);
  data && console.log('data', data.toString());
});

console.log('result', result);

/**
 result undefined
data const fs = require('fs');

const result = fs.readFile('./06_fs.js', (err, data) => {
  err && console.log('err', err);
  data && console.log('data', data.toString());
});

console.log('result', result);
 */

 /**
  读取失败
  result undefined
err { Error: ENOENT: no such file or directory, open 'D:\1git\01max\practice\node\demo\06_fs1.js'
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\1git\\01max\\practice\\node\\demo\\06_fs1.js' }
  */
