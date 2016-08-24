const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./station.controller');

const station = express.Router();

station.use(isAuthenticated);
station.get('/', controller.recent);

station.post('/search', controller.search);
station.get('/popular', controller.topFavorites);
station.get('/favorites', controller.topFavorites);

station.get('/:stationId/podcasts/', controller.listPodcasts);

module.exports = station;
