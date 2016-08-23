const _ = require('lodash');

const baseSettings = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8888,
  ip: process.env.IP || '0.0.0.0',
  secrets: {
    session: process.env.SESSION_SECRET || 'session-secret',
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'facebook-id',
    clientSecret: process.env.FACEBOOK_SECRET || 'facebook-secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`,
  },
};

const environmentSettings = require(`./${baseSettings.env}`);

module.exports = _.merge(baseSettings, environmentSettings || {});
