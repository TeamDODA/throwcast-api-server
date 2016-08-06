const db = require('./db');
const server = require('./server');
const logger = require('winston');

db.on('error', logger.error.bind(logger, 'Mongoose:'));
db.once('open', server.start);
