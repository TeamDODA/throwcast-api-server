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
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 36000 });
};

const isAuthenticated = [accessTokenHeader, validateJwt, populateReqUser];

const sendJWTToken = function sendJWTToken(req, res) {
  if (!req.user) {
    return res.status(404).json({ message: 'Something went wrong, please try again.' });
  }
  return res.json({ token: signToken(req.user._id) });
};

module.exports = {
  accessTokenHeader,
  isAuthenticated,
  populateReqUser,
  sendJWTToken,
  signToken,
  validateJwt,
};
