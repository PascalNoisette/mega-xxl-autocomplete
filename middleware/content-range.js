module.exports = function (req, res, next) {
  res.setHeader('Content-Range', 'bytes : 0-9/*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  next();
};
