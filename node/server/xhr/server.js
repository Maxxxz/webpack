const http = require('http');
const fs = require('fs');
http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    const host = request.headers.host;

    if (url === '/') {
      const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');
      console.log('host', host);
      // if (host === 'a.test.com:8888') {
        response.writeHead(200, {
          'Content-Type': 'text/html', //默认会自动解析，最好自己定义好content Type
          'Set-Cookie': [
            'id=123; max-age=300',
            'abc=456; domain=b.test.com',
            'efg=789; HttpOnly'
          ]
        });
      // }
      response.end(html);
    } else if (url === '/error') {
      response.writeHead(500, {
        'Content-Type': 'application/json'
      });
      response.end('error');
    } else if (url === '/success') {
      response.writeHead(200, {
        'Content-Type': 'application/json'
      });
      response.end('{success}');
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
