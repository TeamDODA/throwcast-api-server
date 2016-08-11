const logger = require('winston');

module.exports.handleError = (res, statusCode) => {
  const code = statusCode || 500;
  return err => {
    logger.error(err);
    res.status(code).send(err);
  };
};

module.exports.validationError = (res, statusCode) => {
  const code = statusCode || 422;
  return err => {
    logger.error(err.message);
    let error;
    switch (err.code) {
      case 11000:
        error = { message: 'Username already in use' };
        break;
      default:
        error = err;
        break;
    }
    res.status(code).send(error);
  };
};
