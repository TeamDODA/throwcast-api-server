const passport = require('passport');
const LocalStrategy = require('passport-local');

const { signToken } = require('../auth.service');
const User = require('../../api/user/user.model');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  User.findOne({ username }).exec()
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Invalid username' });
      }
      return User.comparePassword(password, user.password)
        .then(authenticated => {
          if (!authenticated) {
            return done(null, false, { message: 'Invalid password' });
          }
          return done(null, user);
        });
    })
    .catch(err => done(err));
}));

const controller = {};

controller.auth = function auth(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' });
    }
    return res.json({ token: signToken(user._id) });
  })(req, res, next);
};

module.exports = controller;
