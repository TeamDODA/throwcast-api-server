const { handleError } = require('../../utils');
const Station = require('./station.model');
const Podcast = require('../podcast/podcast.model');

const controller = {};

controller.list = (req, res) => {
  Station.find({}).exec()
    .then(stations => res.json(stations))
    .catch(handleError(res));
};

controller.listPodcasts = (req, res) => {
  Podcast.find({ station: req.params.stationId }).exec()
		.then(podcasts => res.json(podcasts))
		.catch(handleError(res));
};

module.exports = controller;
