const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async (src, dir) => {
  if (/\.(jpg|png|gif)$/.test(src)) {
    console.log('goto urlToImg');
    await urlToImg(src, dir);
  } else {
    await base64ToImg(src, dir);
  }
};

// url -> image
const urlToImg = promisify((url, dir, callback) => {
  const mod = /^https:/.test(url) ? https : http;
  const ext = path.extname(url);
  const file = path.join(dir, `${Date.now()}${ext}`);
  console.log('url', url);
  console.log('file', file);
  
  mod.get(url, res => {
    console.log('url res', res);
    res.pipe(fs.createWriteStream(file)).on('finish', () => {
      callback();
      console.log(file);
    });
  });
});

//base64 -> image
const base64ToImg = async function(base64Str, dir) {
  try {
    // data:image/jpeg;base64,/xxxxx
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);

    const ext = matches[1].split('/')[1].replace('jpeg', jpg);
    const file = path.join(dir, `${Date.now()}.${ext}`);

    await writeFile(file, matches[2], 'base64');
  } catch (error) {
    console.log('base64 解析出错', error);
  }
};
