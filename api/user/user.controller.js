const { validationError } = require('../../utils');
const { signToken } = require('../../auth/auth.service');
const User = require('./user.model');

const controller = {};

controller.create = function create(req, res) {
  const { username, password } = req.body;
  User.create({ username, password, provider: 'local' })
    .then(user => signToken(user._id))
    .then(token => res.json({ token }))
    .catch(validationError(res, 422));
};

module.exports = controller;
