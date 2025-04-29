const AppError = require("../utils/appError");

const sendDevError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERR 💥 something went very wrong", err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: "something went very wrong! Please try again later",
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value for ${field}`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data: ${errors.join(". ")}`;

  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "CastError") err = handleCastError(err);
  if (err.code === 11000) err = handleDuplicateFieldError(err);
  if (err.name === "ValidationError") err = handleValidationError(err);

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }
};
