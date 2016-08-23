const u = require('../../utils');
const Station = require('./station.model');
const Podcast = require('../podcast/podcast.model');
const User = require('../user/user.model');

const controller = {};

controller.list = function list(req, res) {
  Station.find({}).exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.popular = function popular(req, res) {
  const pipeline = [];
  pipeline.push({ $project: { subscriptions: 1 } });
  pipeline.push({ $unwind: '$subscriptions' });
  pipeline.push({ $group: { _id: '$subscriptions', count: { $sum: 1 } } });
  pipeline.push({ $sort: { count: -1, _id: 1 } });
  pipeline.push({
    $lookup: { from: 'stations', localField: '_id', foreignField: '_id', as: 'station' },
  });
  pipeline.push({ $unwind: '$station' });
  pipeline.push({ $project: { _id: 0, station: 1, count: 1 } });
  User.aggregate(pipeline)
    .then(results => res.json(results))
    .catch(u.handleError(res));
};

controller.listPodcasts = function listPodcasts(req, res) {
  Podcast.find({ station: req.params.stationId }).exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
