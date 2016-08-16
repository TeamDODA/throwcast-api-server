const { validationError, handleError } = require('../../utils');
const { signToken } = require('../../auth/auth.service');
const User = require('./user.model');

const controller = {};

controller.create = function create(req, res) {
  const { username, password } = req.body;
  return User.create({ username, password, provider: 'local' })
    .then(user => signToken(user._id))
    .then(token => res.json({ token }))
    .catch(validationError(res, 422));
};

controller.me = function me(req, res) {
  return User.findById(req.user._id)
    .populate('subscriptions')
    .exec()
    .then(user => res.json(user))
    .catch(handleError(res));
};

controller.addStation = function addStation(req, res) {
  return User.findById(req.params.userId).exec()
    .then(user => {
      user.subscriptions.push({ stations: req.body.stationId });
      return user.save();
    })
    .then(results => res.send(results))
    .catch(handleError(res));
};

controller.deleteStation = function deleteStation(req, res) {
  const { userId, stationId } = req.params;
  return User.update(
    { _id: userId },
    { $pull: { subscriptions: stationId } }
  ).exec()
    .then(response => {
      if (response.nModified > 0) {
        return res.sendStatus(202);
      }
      return res.send('station not found');
    })
    .catch(handleError(res));
};

module.exports = controller;
