const jwt = require('jsonwebtoken');

const { handleError } = require('../../utils');
const config = require('../../config/environment');
const User = require('./user.model');

const SECRET = config.secrets.session;
const controller = {};

const signToken = username => jwt.sign({ user: username }, SECRET, { expiresIn: 3600 });

const checkPassword = function checkPassword(password) {
  return storedUser => {
    if (storedUser) {
      return User.comparePassword(password, storedUser.password);
    }
    return false;
  };
};

const createUserIfNotFound = function createUserIfNotFound(username, password) {
  return storedUser => {
    if (!storedUser) {
      return User.create({ username, password });
    }
    return null;
  };
};

const sendTokenOrError = function sendTokenOrError(username, statusMessage, res) {
  return matches => {
    if (matches) {
      return res.send({ token: signToken(username) });
    }
    return res.send({ statusMessage });
  };
};

/**
 * Compares stored and submitted password and sends signed token if hashes match
 */
controller.login = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).exec()
    .then(checkPassword(password))
    .then(sendTokenOrError(username, 'invalid login', res))
    .catch(handleError(res));
};

/**
 * Tries to sign up the user with submitted username and password and signs them in
 */
controller.signUp = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).exec()
    .then(createUserIfNotFound(username, password))
    .then(sendTokenOrError(username, 'username exists', res))
    .catch(handleError(res));
};

module.exports = controller;
