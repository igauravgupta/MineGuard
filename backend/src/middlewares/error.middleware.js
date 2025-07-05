const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    success: err.success,
    data: err.data,
    message: err.message,
  });
};

export { errorMiddleware };
