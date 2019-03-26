const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');

const route = require('./helper/router');

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  console.log('filePath', filePath);
  route(req, res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`;
  console.log(`Server listen on ${chalk.green(addr)}`);
});
