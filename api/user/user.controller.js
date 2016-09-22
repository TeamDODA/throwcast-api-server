const u = require('../../utils');
const { signToken } = require('../../auth/auth.service');
const User = require('./user.model');

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
  return res.json(req.user);
};

module.exports = controller;
