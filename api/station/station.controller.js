const u = require('../../utils');
const Station = require('./station.model');
const Podcast = require('../podcast/podcast.model');

const controller = {};

controller.list = (req, res) => {
  Station.find({}).exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.listPodcasts = (req, res) => {
  Podcast.find({ station: req.params.stationId }).exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
