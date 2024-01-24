const errorHandler = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong!",
  };
  return res.status(error.statusCode).json({
    message: error.message,
    //message: err,
  });
};

module.exports = errorHandler;
