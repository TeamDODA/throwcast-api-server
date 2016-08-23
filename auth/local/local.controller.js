const passport = require('passport');
const LocalStrategy = require('passport-local');

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
      return user.authenticate(password)
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
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  })(req, res, next);
};

module.exports = controller;
