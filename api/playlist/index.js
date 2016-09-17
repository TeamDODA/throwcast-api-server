const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { populateReqPlaylist, isPlaylistOwner } = require('./playlist.auth');

const playlist = express.Router();

playlist.use(isAuthenticated);

playlist.post('/', controller.create);
playlist.post('/search', controller.search);

playlist.get('/', controller.recent);
playlist.get('/favorites', controller.topFavorites);
playlist.get('/:playlistId', populateReqPlaylist, controller.details);

playlist.delete('/:playlistId', isPlaylistOwner, controller.remove);
playlist.put('/:playlistId', isPlaylistOwner, controller.update);

module.exports = playlist;
