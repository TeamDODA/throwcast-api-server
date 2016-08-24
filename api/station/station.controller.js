const u = require('../../utils');
const Station = require('./station.model');
const Podcast = require('../podcast/podcast.model');
const Favorite = require('../favorite/favorite.model');
const User = require('../user/user.model');

const controller = {};

controller.recent = function recent(req, res) {
  Station.find({})
    .sort({ updated: -1 })
    .limit(100)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.topSubscribed = function popular(req, res) {
  const pipeline = [];
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

const favoriteStationsPipeline = [
  { $match: { from: 'stations' } },
  { $group: { _id: '$localField', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } },
  { $limit: 50 },
  { $lookup: { from: 'stations', localField: '_id', foreignField: '_id', as: 'station' } },
  { $unwind: '$station' },
  { $project: { _id: 0, count: 1, podcast: 1 } },
];

controller.topFavorites = function popular(req, res) {
  Favorite.aggregate(favoriteStationsPipeline)
    .then(results => res.json(results))
    .catch(u.handleError(res));
};

controller.listPodcasts = function listPodcasts(req, res) {
  Podcast.find({ station: req.params.stationId }).exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
