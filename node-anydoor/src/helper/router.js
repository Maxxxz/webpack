const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');
const tplPath = path.join(__dirname, '../template/dir.tpl'); //读出来的是buffer，要么加第二个入参 'utf-8'
const conf = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cahce');

const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function(req, res, filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      res.setHeader('Content-Type', mime(filePath));

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const { code, start, end } = range(stat.size, req, res);
      console.log('code, start, end', code, start, end);
      //后面有兴趣，还可以处理code 是 216,416的情况
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = code;
        rs = fs.createReadStream(filePath, {
          start,
          end
        });
      }

      if (filePath.match(conf.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(conf.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '', //相对路径
        files: files.map(file => {
          return { file, icon: mime(filePath) };
        })
      };
      res.end(template(data));
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} no found\n ${err.toString()}`);
    return '';
  }
};
