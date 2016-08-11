const express = require('express');
const configExpress = require('./config/express');
const configRoutes = require('./config/router');

const app = express();

configExpress(app);
configRoutes(app);

module.exports = app;
