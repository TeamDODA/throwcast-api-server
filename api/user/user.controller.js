const jwt = require('jsonwebtoken');
const logger = require('winston');

const config = require('../../config/environment');
const User = require('./user.model');

const SECRET = config.secrets.session;

const signToken = username => jwt.sign({ user: username }, SECRET, { expiresIn: 3600 });

module.exports = {
  login: (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }).exec()
      .then(user => user ? User.comparePassword(password, user.password) : false)
      .then(valid => valid ? res.send({token: signToken(username)}) : res.send({statusMessage: 'invalid login'}))
      .catch(err => logger.info(err));
  },
  signUp: (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }).exec()
      .then(function (foundUser) {
        if (!foundUser) {
          return User.create({ username, password });
        }
      })
      .then(valid => valid ? res.send({token: signToken(valid.username)}) : res.send({statusMessage: 'username exists'}))
      .catch(err => logger.info(err));
  },
};
