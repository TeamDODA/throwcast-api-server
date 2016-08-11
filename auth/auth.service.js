const jwt = require('jsonwebtoken');

const config = require('../config/environment');

const SECRET = config.secrets.session;

module.exports.signToken = function signToken(username) {
  return jwt.sign({ user: username }, SECRET, { expiresIn: 3600 });
};
