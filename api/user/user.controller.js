const { validationError, handleError } = require('../../utils');
const { signToken } = require('../../auth/auth.service');
const User = require('./user.model');
const Station = require('../station/station.model');

const controller = {};

controller.create = function create(req, res) {
  const { username, password } = req.body;
  return User.create({ username, password, provider: 'local' })
    .then(user => signToken(user._id))
    .then(token => res.json({ token }))
    .catch(validationError(res, 422));
};

controller.me = function me(req, res) {
  const opts = [{ path: 'subscriptions', model: 'Station' }];
  return User.populate(req.user, opts)
    .then(user => res.json(user))
    .catch(handleError(res));
};

controller.subscribe = function subscribe(req, res) {
  let station;
  return Station.findById(req.body.stationId)
    .then(found => (station = found))
    .then(() => req.user.subscriptions.push(station._id))
    .then(() => req.user.save())
    .then(() => res.json(station))
    .catch(handleError(res));
};

controller.unsubscribe = function unsubscribe(req, res) {
  const { stationId } = req.params;
  req.user.subscriptions.pull(stationId);
  return req.user.save()
    .then(() => res.sendStatus(202))
    .catch(handleError(res));
};

module.exports = controller;
