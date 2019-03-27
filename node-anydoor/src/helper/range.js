module.exports = function(totalSize, req, res) {
  const range = req.headers['range'];
  if (!range) return { code: 200 };
  const sizes = range.match(/bytes=(\d*)-(\d*)/);
  const end = sizes[2] || totalSize - 1;
  const start = sizes[1] || totalSize - end;

  if (start > end || start < 0 || end > totalSize) {
    return { code: 200 };
  }
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Conent-Range', `bytes ${start}-${end}`);
  res.setHeader('Content-Length', end - start);
  return {
    code: 206,
    start: parseInt(start), //必须是数字，不然fs.readstream接收的时候会报错
    end: parseInt(end)
  };
};
