const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { populateReqPlaylist, isPlaylistOwner } = require('./playlist.auth');

const playlists = express.Router();

playlists.use(isAuthenticated);
playlists.get('/', controller.lists);
playlists.post('/', controller.create);

playlists.delete('/:playlistId', isPlaylistOwner, controller.remove);
playlists.get('/:playlistId', populateReqPlaylist, controller.details);
playlists.put('/:playlistId', isPlaylistOwner, controller.update);

module.exports = playlists;
