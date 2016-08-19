const u = require('../../utils');
const { signToken } = require('../../auth/auth.service');
const User = require('./user.model');
const Station = require('../station/station.model');

const controller = {};

controller.create = function create(req, res) {
  const { username, password } = req.body;
  return User.create({ username, password, provider: 'local' })
    .then(user => signToken(user._id))
    .then(token => ({ token }))
    .then(u.respondWithResult(res))
    .catch(u.validationError(res, 422));
};

controller.me = function me(req, res) {
  const opts = [{ path: 'subscriptions', model: 'Station' }];
  return User.populate(req.user, opts)
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.subscribe = function subscribe(req, res) {
  return Station.findById(req.body.stationId)
    .then(u.handleEntityNotFound(res))
    .then(entity => {
      if (entity) {
        req.user.subscriptions.push(entity._id);
        return req.user.save()
          .then(() => entity)
          .then(u.respondWithResult(res));
      }
      return null;
    })
    .catch(u.handleError(res));
};

controller.unsubscribe = function unsubscribe(req, res) {
  const { stationId } = req.params;
  req.user.subscriptions.pull(stationId);
  return req.user.save()
    .then(() => res.sendStatus(204))
    .catch(u.handleError(res));
};

module.exports = controller;
