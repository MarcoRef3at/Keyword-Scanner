const ErrorResponse = require("../utils/errorResponse");

const errorHandler = async (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  // console.log("err".bgYellow, err);

  res.status(error.statusCode || 500).json({
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
