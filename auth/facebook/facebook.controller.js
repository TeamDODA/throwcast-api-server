const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('../../api/user/user.model');
const config = require('../../config/environment');

const oauthSuccess = function oauthSuccess(accessToken, refreshToken, profile, done) {
  User.findOne({ 'facebook.id': profile.id })
    .then(foundUser => {
      if (foundUser) {
        return done(null, foundUser);
      }

      const user = new User({
        username: profile.displayName,
        provider: 'facebook',
        facebook: profile._json,
      });
      return user.save()
        .then(savedUser => done(null, savedUser))
        .catch(err => done(err));
    })
    .catch(err => done(err));
};

const callbackConfig = {
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL,
  profileFields: [
    'displayName',
    'emails',
  ],
};
passport.use(new FacebookStrategy(callbackConfig, oauthSuccess));

const tokenConfig = {
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
};
passport.use(new FacebookTokenStrategy(tokenConfig, oauthSuccess));

const controller = {};

const callbackOpts = { failureRedirect: '/signup', session: false };
const redirectOpts = Object.assign({}, callbackOpts, { scope: ['email', 'user_about_me'] });

controller.authRedirect = passport.authenticate('facebook', redirectOpts);
controller.callbackAuth = passport.authenticate('facebook', callbackOpts);
controller.tokenAuth = passport.authenticate('facebook-token');

module.exports = controller;
