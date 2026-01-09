const ErrorHandler = require("../utils/errorHandler");

exports.notFoundMiddleware = (req, res, next) => {
  return next(new ErrorHandler(`Not Found - ${req.originalUrl}`, 404));
};

exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  } else {
    let error = { ...err };
    error.message = err.message;
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new ErrorHandler(message, 400);
    }
    //wrong Mongoose Object ID Error.
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }
    //Mongoose Duplicate key Error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }
    //Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }
    //Expired JWT Error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is Expired. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};
