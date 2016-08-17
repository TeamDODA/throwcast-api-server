const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const config = require('../config/environment');
const { populateReqUser } = require('../api/user/user.auth');

const accessTokenHeader = function accessTokenHeader(req, res, next) {
  const { query, headers } = req;
  if (query && {}.hasOwnProperty.call(query, 'access_token')) {
    headers.authorization = `Bearer ${query.access_token}`;
  }
  next();
};

const validateJwt = expressJwt({ secret: config.secrets.session });

const signToken = function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 3600 });
};

const isAuthenticated = [accessTokenHeader, validateJwt, populateReqUser];

module.exports = {
  accessTokenHeader,
  validateJwt,
  populateReqUser,
  signToken,
  isAuthenticated,
};
