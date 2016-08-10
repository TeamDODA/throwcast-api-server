const { handleError } = require('../../utils');
const Station = require('./station.model');

const controller = {};

controller.list = (req, res) => {
  Station.find({}).exec()
    .then(stations => res.json(stations))
    .catch(handleError(res));
};

module.exports = controller;
