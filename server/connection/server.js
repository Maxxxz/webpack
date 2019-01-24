const http = require('http');
const fs = require('fs');
http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    const host = request.headers.host;

    const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');
    const img = fs.readFileSync(require.resolve('./test.jpg'));
    console.log('host', host);
    if (request.url === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/html', //默认会自动解析，最好自己定义好content Type
        'Connection': 'close'  //关闭长链接
      });
      response.end(html);
    } else {
      response.writeHead(200, {
        'Content-Type': 'image/jpg',
        'Connection': 'close'  //关闭长链接
      });
      response.end(img);
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
