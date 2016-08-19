const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { populateReqPlaylist, isPlaylistOwner } = require('./playlist.auth');

const playlists = express.Router();

// TODO: Use isAuthenticated for all routes for this router

playlists.get('/', isAuthenticated, controller.lists);
playlists.post('/', isAuthenticated, controller.create);

playlists.get('/:playlistId', isAuthenticated, populateReqPlaylist, controller.show);
playlists.delete('/:playlistId', isPlaylistOwner, controller.delete);
playlists.put('/:playlistId', isPlaylistOwner, controller.update);

playlists.post('/:playlistId/podcasts/', isPlaylistOwner, controller.addPodcast);
playlists.delete('/:playlistId/podcasts/:podcastId', isPlaylistOwner, controller.removePodcast);

module.exports = playlists;
