const u = require('../../../utils');
const User = require('../user.model');

const controller = {};

controller.update = function create(req, res) {
  const opts = { runValidators: true, new: true };
  User
    .findByIdAndUpdate(req.user.id, { subscriptions: req.body }, opts)
    .populate('subscriptions').exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
