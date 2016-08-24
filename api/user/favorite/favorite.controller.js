const u = require('../../../utils');
const Favorite = require('../../favorite/favorite.model');

const controller = {};

const userFavoritesPipeline = [
  { $lookup: { from: 'playlists', localField: 'localField', foreignField: '_id', as: 'playlist' } },
  { $lookup: { from: 'podcasts', localField: 'localField', foreignField: '_id', as: 'podcast' } },
  { $lookup: { from: 'stations', localField: 'localField', foreignField: '_id', as: 'station' } },
  {
    $group: {
      _id: '$from',
      playlists: { $push: '$$ROOT.playlists' },
      podcasts: { $push: '$$ROOT.podcast' },
      stations: { $push: '$$ROOT.station' },
    },
  },
];

const reshapeAggregation = function reshapeAggregation(result) {
  return result.reduce((p, favorite) => {
    const key = favorite._id;
    p[key] = favorite[key]; // eslint-disable-line no-param-reassign
    return p;
  }, {});
};

controller.favorites = function create(req, res) {
  const userPipeline = [{ $match: { user: req.user._id } }].concat(userFavoritesPipeline);
  Favorite.aggregate(userPipeline)
    .then(reshapeAggregation)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
