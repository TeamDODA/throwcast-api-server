const parser = require('body-parser');
const morgan = require('morgan');
const environment = require('./environment');

module.exports = app => {
  app.set('port', environment.port);
  app.set('ip', environment.ip);
  app.use(morgan('dev'));
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));
};
