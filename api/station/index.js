const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./station.controller');

const station = express.Router();

station.use(isAuthenticated);

station.post('/search', controller.search);

station.get('/', controller.recent);
station.get('/favorites', controller.topFavorites);
station.get('/:stationId', controller.details);

module.exports = station;
