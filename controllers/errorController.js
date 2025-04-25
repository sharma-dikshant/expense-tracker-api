module.exports = (err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
