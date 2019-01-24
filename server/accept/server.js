const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    const host = request.headers.host;

    const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');
    //gzip 需要用默认值Buffer的数据格式

    response.writeHead(200, {
      'Content-Type': 'text/html', //默认会自动解析，最好自己定义好content Type
      // 'Content-Encoding': 'gzip'
    });

    response.end(html);
    // response.end(zlib.gzipSync(html));
  })
  .listen(8888);

console.log('server listyening on 8888');
