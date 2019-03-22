const fs = require('fs');

const ws = fs.createWriteStream('./test.txt');

const tid = setInterval(() => {
  const num = parseInt(Math.random() * 10);
  console.log(num);
  if (num < 7) {
    //写入的内容只支持字符串或者buffer！其他不支持
    //因为buffer和字符串可以自由转换！
    ws.write(String(num));
  } else {
    clearInterval(tid);
    ws.end();
  }
});

ws.on('finish', () => {
  console.log('done!');
});
