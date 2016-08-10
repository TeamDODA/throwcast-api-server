const Station = require('./station.model');
const logger = require('winston');

const controller = {};
const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => {
    logger.error(err);
    res.status(statusCode).send(err);
  };
};

controller.list = (req, res) => {
  Station.find({}).exec()
    .then(stations => res.json(stations))
    .catch(handleError(res));
};

module.exports = controller;
