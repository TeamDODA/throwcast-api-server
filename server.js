const configExpress = require('./config/express');
const express = require('express');

const app = express();

configExpress(app);

module.exports.start = () => app.listen(app.get('port'), app.get('ip'), err => {
  /* eslint-disable no-console */
  if (err) {
    console.log(`Error starting server: ${err}`);
  } else {
    console.log(`Listening on port ${app.get('port')} in ${app.get('env')} mode...`);
  }
  /* eslint-disable no-console */
});
