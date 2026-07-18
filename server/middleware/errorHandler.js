// Central error handler middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} →`, message);
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
