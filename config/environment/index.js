const _ = require('lodash');

const baseSettings = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8888,
  ip: process.env.IP || '0.0.0.0',
};

const environmentSettings = require(`./${baseSettings.env}`);

module.exports = _.merge(baseSettings, environmentSettings || {});
