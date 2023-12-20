const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = async (err, req, res, next) => {
  let { statusCode, msg } = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  }
  if (err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST
    msg = `The ${Object.keys(
      err.keyValue
    )} is already used, please login or try a new ${Object.keys(err.keyValue)}`
  }
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST
    msg = Object.values(err.errors)
      .map((i) => i.message)
      .join(', ')
  }
  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST
    msg = `No resource exists with id ${err.value}`
  }

  res.status(statusCode).json({ success: false, msg })
}

module.exports = errorHandlerMiddleware
