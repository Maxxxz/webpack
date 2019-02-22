const http = require('http');
const fs = require('fs');

const wait = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};

http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    const host = request.headers.host;
    console.log('host', host);
    const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');

    if (url === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(html);
    } else if (url === '/data') {
      response.writeHead(200, {
        // 'Cache-Control': 'max-age=2, s-maxage=20'
        'Cache-Control': 's-maxage=200',
        'Vary': 'X-Test-Cache'
      });
      wait(2).then(() => response.end('success'));
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/javascript' //默认会自动解析，最好自己定义好content Type
      });
      response.end('console.log("loaded scrpit")');
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
