const http = require('http');
const fs = require('fs');
http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    if (url === '/') {
      const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');
      response.writeHead(200, {
        'Content-Type': 'text/html' //默认会自动解析，最好自己定义好content Type
      });
      response.end(html);
    } else if (url === '/script.js') {
      const commonEtag = '777';
      const requestEtag = request.headers['if-none-match'];
      if (requestEtag === commonEtag) {
        response.writeHead(304, {
          'Content-Type': 'text/javascript', //默认会自动解析，最好自己定义好content Type
          // 'Cache-Control': 'max-age=2000000, public, no-cache', // 重复的话，后面会覆盖前面的
          'Last-Modified': '123',
          'Etag': commonEtag
        });
        response.end('');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/javascript', //默认会自动解析，最好自己定义好content Type
          // 'Cache-Control': 'max-age=2000000, public, no-cache', // 重复的话，后面会覆盖前面的
          'Last-Modified': '123',
          'Etag': commonEtag
        });
        response.end('console.log("script loaded 2")');
      }
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
