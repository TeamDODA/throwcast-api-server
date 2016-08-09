const express = require('express');
const configExpress = require('./config/express');

const app = express();

configExpress(app);

module.exports = app;
