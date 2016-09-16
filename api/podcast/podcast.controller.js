const Promise = require('bluebird');

const u = require('../../utils');
const Favorite = require('../favorite/favorite.model');
const Podcast = require('./podcast.model');

const controller = {};

controller.recent = function recent(req, res) {
  Podcast.find({})
    .sort({ published: -1 })
    .limit(100)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.detail = function recent(req, res) {
  Podcast.findById(req.params.podcastId)
    .then(u.handleEntityNotFound(res))
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

const searchOpts = {
  size: 50,
  hydrate: true,
  hydrateWithESResults: true,
};

const searchPodcasts = function searchPodcasts(queryObj) {
  return new Promise((resolve, reject) => {
    Podcast.search(queryObj, searchOpts, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

controller.search = function search(req, res) {
  const { query } = req.body;
  searchPodcasts({ simple_query_string: { query } })
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

const favoritePodcastsPipeline = [
  { $match: { from: 'podcasts' } },
  { $group: { _id: '$localField', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } },
  { $limit: 50 },
  { $lookup: { from: 'podcasts', localField: '_id', foreignField: '_id', as: 'podcast' } },
  { $unwind: '$podcast' },
  { $project: { _id: 0, count: 1, podcast: 1 } },
];

controller.topFavorites = function popular(req, res) {
  Favorite.aggregate(favoritePodcastsPipeline)
    .then(results => res.json(results))
    .catch(u.handleError(res));
};

module.exports = controller;
