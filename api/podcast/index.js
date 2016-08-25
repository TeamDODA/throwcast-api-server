const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./podcast.controller');

const podcast = express.Router();

podcast.use(isAuthenticated);
podcast.get('/', controller.recent);

podcast.get('/:podcastId', controller.detail);

podcast.post('/search', controller.search);
podcast.get('/favorites', controller.topFavorites);

module.exports = podcast;
