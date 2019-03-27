module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: '8899',
  compress: /\.(html|js|css|md)\b/,
  cache: {
    maxAge: 600, //单位s
    expires: true,  //虽然是被淘汰的，但有些老的浏览器可能还在用
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
