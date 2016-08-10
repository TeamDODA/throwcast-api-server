const logger = require('winston');

module.exports.handleError = (res, statusCode) => {
  const code = statusCode || 500;
  return err => {
    logger.error(err);
    res.status(code).send(err);
  };
};
