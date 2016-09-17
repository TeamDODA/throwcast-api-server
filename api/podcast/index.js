const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./podcast.controller');

const podcast = express.Router();

podcast.use(isAuthenticated);

podcast.post('/search', controller.search);

podcast.get('/', controller.recent);
podcast.get('/favorites', controller.topFavorites);
podcast.get('/:podcastId', controller.detail);

module.exports = podcast;
