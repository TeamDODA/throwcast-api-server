const mongoose = require('mongoose');
const _ = require('lodash');
const u = require('../../../utils');
const Favorite = require('../../favorite/favorite.model');

const controller = {};

const lookupPipeline = [
  { $lookup: { from: 'playlists', localField: 'localField', foreignField: '_id', as: 'playlist' } },
  { $lookup: { from: 'podcasts', localField: 'localField', foreignField: '_id', as: 'podcast' } },
  { $lookup: { from: 'stations', localField: 'localField', foreignField: '_id', as: 'station' } },
];

const reshapeAggregation = function reshapeAggregation(result) {
  return _(result)
    .map(obj => ({ type: obj.from, value: obj[obj.from.slice(0, -1)][0] }))
    .groupBy('type')
    .mapValues(values => _.map(values, 'value'))
    .value();
};

controller.favorites = function favorites(req, res) {
  const userPipeline = [{ $match: { user: req.user._id } }].concat(lookupPipeline);
  Favorite.aggregate(userPipeline)
    .then(reshapeAggregation)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.remove = function create(req, res) {
  const { from, id } = req.params;
  const user = req.user._id;
  Favorite.findOne({ from, localField: new mongoose.Types.ObjectId(id), user })
    .then(doc => doc.remove())
    .then(() => res.sendStatus(204))
    .catch(u.handleError(res));
};

module.exports = controller;
