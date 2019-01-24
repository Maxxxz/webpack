const http = require('http');
const fs = require('fs');
http
  .createServer(function(request, response) {
    const url = request.url;
    console.log('request come', url);

    if (url === '/') {
      response.writeHead(301, {   //301永久重定向，这样浏览器在第二次访问的时候，浏览器会自动做链接变化，而不用服务器端做变化，除非清楚缓存，否则会一直这样。
        'Location': '/new' 
        //同域不需要指定host和端口,必须搭配302用，用200的话这个属性不生效
      })
      response.end();
    }else if(url === '/new'){
      response.writeHead(200, {
        'Content-Type': 'text/html', //默认会自动解析，最好自己定义好content Type 
      });
      response.end('<div>content</div>');
    }
  })
  .listen(8888);

console.log('server listyening on 8888');
