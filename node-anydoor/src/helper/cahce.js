const { cache } = require('../config/defaultConfig');

function refreshRes(stats, res) {
  const { maxAge, expires, cacheControl, lastModified, etag } = cache;
  if (expires) {
    res.setHeader('Expires', new Date(Date.now() + maxAge * 1000));
  }
  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }
  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }
  if (etag) {
    res.setHeader('Etag', `${stats.size}-${stats.mtime}`);
  }
}

//判断缓存是否是新鲜的。就是判断缓存是不是最新的。
module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);
  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('Etag')) {
    return false;
  }

  return true;
};
