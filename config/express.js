const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const environment = require('./environment');

module.exports = function config(app) {
  app.set('port', environment.port);
  app.set('ip', environment.ip);
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
