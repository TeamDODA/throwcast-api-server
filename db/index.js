const mongoose = require('mongoose');
const config = require('../config/environment');

mongoose.connect(config.mongo.uri);

const db = mongoose.connection;

module.exports = db;
