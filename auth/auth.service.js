const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const config = require('../config/environment');
const User = require('../api/user/user.model');

const accessTokenHeader = function accessTokenHeader(req, res, next) {
  const { query, headers } = req;
  if (query && {}.hasOwnProperty.call(query, 'access_token')) {
    headers.authorization = `Bearer ${query.access_token}`;
  }
  next();
};

const validateJwt = expressJwt({ secret: config.secrets.session });

const populateReqUser = function populateReqUser(req, res, next) {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(401).end();
      }
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(err => next(err));
};

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
