const logger = require("../config/logger");
const mongoose = require("mongoose");
const ApiError = require("../config/error");
const { StatusCodes } = require("http-status-codes");

const errorConvertor = (err, req, res, next) => {
  let error = err;
  try {
    if (!(error instanceof ApiError)) {
      let statusCode;
      let message;
      if (error.statusCode || err instanceof mongoose.Error) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = error.message || "Bad Request";
      } else {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        error.message = mongooseErrorHandler(error);

        message = error.message || "Internal Server Error";
      }

      error = new ApiError(statusCode, message);
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: errorMiddleware.js:23 ~ errorConvertor ~ error:",
      error
    );
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  const response = {
    error: true,
    statusCode,
    message,
  };
  if (process.env.NODE_ENV == "development") {
    logger.error(`${err}`);
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  errorConvertor,
  errorHandler,
};

const mongooseErrorHandler = (error) => {
  let message = "";
  if (error instanceof mongoose.Error.ValidationError) {
    message = `${error.errors["name"].kind}: ${error.errors["name"].path} : ${error.errors["name"].value}`;
  } else if (error.code === 11000) {
    let key = Object.keys(error.keyValue)[0];

    message = `Duplicate Record Found for ${
      key[0].toUpperCase() + key.slice(1)
    } `;
  }
  return message;
};
