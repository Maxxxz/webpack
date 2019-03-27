const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/router');
const openUrl = require('./helper/openUrl.js');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      console.log('filePath', filePath);
      route(req, res, filePath);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.log(`Server listen on ${chalk.green(addr)}`);
      openUrl(addr)
    });
  }
}

module.exports = Server;
