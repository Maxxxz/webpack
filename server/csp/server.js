const http = require('http');
const fs = require('fs');
http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);
    const host = request.headers.host;
    console.log('host', host);
    const html = fs.readFileSync(require.resolve('./test.html'), 'utf8');
    
    if (request.url === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/html', //默认会自动解析，最好自己定义好content Type
        // 只允许http链接的资源加载
        // 'Content-Security-Policy': 'default-src http: https: '
        //只允许同域的资源加载
        // 'Content-Security-Policy': "default-src 'self' ",
        //同域+指定域名 
        // code.jquery.com, https://code.jquery.com 都支持，
        // 必须指定二级域名，用一级域名不行
        // 'Content-Security-Policy': "default-src 'self' code.jquery.com "
        //限制表单
        //'Content-Security-Policy': "default-src 'self'; form-action 'self'"
        // 'Content-Security-Policy': "default-src 'self'; report-uri /report "
        // 允许加载，但会上报对应限制的内容
        // 'Content-Security-Policy-Report-Only': "default-src 'self'; report-uri /report"
         //限制ajax
         'Content-Security-Policy': "connect-src 'self'; report-uri /report"
      });
      response.end(html);
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/javascript' //默认会自动解析，最好自己定义好content Type
      });
      response.end('console.log("loaded scrpit")');
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
