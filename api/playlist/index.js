const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { populateReqPlaylist, isPlaylistOwner } = require('./playlist.auth');

const playlists = express.Router();

// TODO: Use isAuthenticated for all routes for this router

playlists.get('/', isAuthenticated, controller.lists);
playlists.post('/', isAuthenticated, controller.create);

playlists.delete('/:playlistId', isPlaylistOwner, controller.delete);
playlists.get('/:playlistId', isAuthenticated, populateReqPlaylist, controller.show);
playlists.put('/:playlistId', isPlaylistOwner, controller.update);

module.exports = playlists;
