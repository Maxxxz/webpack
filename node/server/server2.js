const http = require('http');
let i = 0;
http
  .createServer(function(request, response) {
    console.log('request come', request.url);
    //server2支持跨域
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*', //所有服务都支持
      // 'Access-Control-Allow-Origin': 'http://localhost:8887',
      //只能有一个值，所以要在前面做判断
      'Access-Control-Allow-Headers': 'X-Test-Cors',
      'Access-Control-Allow-Methods': 'PUT, Delete',
      'Access-Control-Max-Age': '0' 
      //单位s， 以这种方式允许的预请求时间。
      //注意，当勾选到浏览器默认清楚缓存的时候，这个属性不生效！给0的时候就肯定会有缓存。
      //没给的话浏览器会给默认值，不同浏览器默认值不一样
    });
    response.end('数字' + i++);
    console.log('request end , go response');
  })
  .listen(8887);

console.log('server listyening on 8887');
