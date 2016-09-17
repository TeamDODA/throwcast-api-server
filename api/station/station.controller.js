const Promise = require('bluebird');

const u = require('../../utils');
const Station = require('./station.model');
const Podcast = require('../podcast/podcast.model');
const Favorite = require('../favorite/favorite.model');

const controller = {};

controller.recent = function recent(req, res) {
  Station.find({})
    .sort({ updated: -1 })
    .limit(100)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

const searchOpts = {
  size: 50,
  hydrate: true,
  hydrateWithESResults: true,
};

const searchStations = function searchStations(queryObj) {
  return new Promise((resolve, reject) => {
    Station.search(queryObj, searchOpts, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

controller.search = function search(req, res) {
  const { query } = req.body;
  searchStations({ simple_query_string: { query } })
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

const favoriteStationsPipeline = [
  { $match: { from: 'stations' } },
  { $group: { _id: '$localField', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } },
  { $limit: 50 },
  { $lookup: { from: 'stations', localField: '_id', foreignField: '_id', as: 'station' } },
  { $unwind: '$station' },
  { $project: { _id: 0, count: 1, station: 1 } },
];

controller.topFavorites = function popular(req, res) {
  Favorite.aggregate(favoriteStationsPipeline)
    .then(results => res.json(results))
    .catch(u.handleError(res));
};

controller.details = function details(req, res) {
  Station.findById(req.params.stationId)
    .lean()
    .then(station => Podcast.find({ station: station._id })
      .then(podcasts => Object.assign(station, { podcasts })))
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
