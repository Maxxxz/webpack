const path = require('path');

const mimeType = {
  css: 'text/css',
  html: 'text/html',
  js: 'text/javascript',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  json: 'application/json',
  txt: 'text/plain'
};

module.exports = function(filePath) {
  let ext = path
    .extname(filePath)
    .split('.')
    .pop();

  ext = ext || filePath;
  console.log('ext', ext);
  return mimeType[ext] || mimeType['txt'];
};
