const express = require('express');
const logger = require('winston');
const configExpress = require('./config/express');

const app = express();

configExpress(app);

module.exports.start = function start() {
  return app.listen(app.get('port'), app.get('ip'), err => {
    if (err) {
      logger.info(`Error starting server: ${err}`);
    } else {
      logger.info(`Listening on port ${app.get('port')} in ${app.get('env')} mode...`);
    }
  });
};
