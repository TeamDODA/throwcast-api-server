const mongoose = require('mongoose');
const Promise = require('bluebird');
const logger = require('winston');

module.exports.handleError = (res, statusCode) => {
  const code = statusCode || 500;
  return err => {
    logger.error(err);
    res.status(code).send(err);
  };
};

module.exports.handleEntityNotFound = function handleEntityNotFound(res) {
  return function handler(entity) {
    if (!entity) {
      res.sendStatus(404);
      return null;
    }
    return entity;
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

module.exports.decorateRequest = function decorateRequest(req, name, next) {
  if (!name) {
    throw Error('decorateRequest requires name argument');
  }
  return function handler(entity) {
    if (entity) {
      req[name] = entity; // eslint-disable-line no-param-reassign
      return next();
    }
    return null;
  };
};

module.exports.respondWithResult = function respondWithResult(res, statusCode) {
  const code = statusCode || 200;
  return function handle(entity) {
    if (entity) {
      return res.status(code).json(entity);
    }
    return null;
  };
};

module.exports.sanitizedUpdate = function sanitizedUpdate(update, fields) {
  const sanitized = Object.assign({}, update);
  fields.forEach(field => delete sanitized[field]);
  return sanitized;
};
