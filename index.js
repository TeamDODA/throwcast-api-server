const configExpress = require('./config/express');
const express = require('express');
const db = require('./db');

const app = express();

configExpress(app);

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  app.listen(app.get('port'), app.get('ip'), () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${app.get('port')} in ${app.get('env')} mode...`);
    /* eslint-disable no-console */
  });
});
