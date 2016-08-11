const jwt = require('jsonwebtoken');

const config = require('../config/environment');

module.exports.signToken = function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 3600 });
};
