const errorMiddleware = (err, req, res, next) => {
  const status = 500 || err.status;
  res.status(status).json({
    message: err.message,
    succes: false,
  });
};

export default errorMiddleware;
