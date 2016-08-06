const mongoose = require('mongoose');
const config = require('../config/environment');
const Promise = require('bluebird');

Promise.promisifyAll(mongoose);

mongoose.connect(config.mongo.uri);

module.exports = mongoose.connection;
