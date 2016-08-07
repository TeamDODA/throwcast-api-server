const mongoose = require('mongoose');
const config = require('../config/environment');
const Promise = require('bluebird');

mongoose.Promise = Promise;

module.exports = {
  connect: () => mongoose.connect(config.mongo.uri),
  connection: mongoose.connection,
};
