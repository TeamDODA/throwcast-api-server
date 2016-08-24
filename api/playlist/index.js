const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { populateReqPlaylist, isPlaylistOwner } = require('./playlist.auth');

const playlist = express.Router();

playlist.use(isAuthenticated);
playlist.get('/', controller.recent);
playlist.post('/', controller.create);

playlist.delete('/:playlistId', isPlaylistOwner, controller.remove);
playlist.get('/:playlistId', populateReqPlaylist, controller.details);
playlist.put('/:playlistId', isPlaylistOwner, controller.update);

playlist.get('/favorites', controller.topFavorites);

module.exports = playlist;
