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

controller.remove = function remove(req, res) {
  req.favorite.remove()
    .then(() => res.sendStatus(204))
    .catch(u.handleError(res));
};

module.exports = controller;
