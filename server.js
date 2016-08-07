const express = require('express');
const Promise = require('bluebird');
const configExpress = require('./config/express');

const app = express();

configExpress(app);

const listen = () => Promise.promisify(app.listen, app)(app.get('port'), app.get('ip'));

module.exports = {
  app,
  listen,
};
