const u = require('../../utils');
const Favorite = require('./favorite.model');

const controller = {};

controller.create = function list(req, res) {
  const sanitized = u.sanitizedUpdate(req.body, ['_id', 'user']);
  sanitized.user = req.user._id;
  Favorite.create(sanitized)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.favorite = function favorite(from, as) {
  return function list(req, res) {
    const pipeline = [];
    pipeline.push({ $match: { from, user: req.user._id } });
    pipeline.push({
      $lookup: { from, localField: 'localField', foreignField: '_id', as },
    });
    pipeline.push({ $unwind: `$${as}` });
    pipeline.push({ $project: { _id: 1, station: 1 } });
    Favorite.aggregate(pipeline)
      .then(u.respondWithResult(res))
      .catch(u.handleError(res));
  };
};

controller.remove = function remove(req, res) {
  req.favorite.remove()
    .then(() => res.sendStatus(204))
    .catch(u.handleError(res));
};

module.exports = controller;
