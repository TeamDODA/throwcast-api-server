const express = require('express');
const controller = require('./playlist.controller');
const { isAuthenticated } = require('../../auth/auth.service');

const playlists = express.Router();

// TODO: Use isAuthenticated for all routes for this router

playlists.get('/', isAuthenticated, controller.lists);
playlists.post('/', isAuthenticated, controller.create);

playlists.get('/:playlistId', controller.show);
playlists.delete('/:playlistId', controller.delete);

playlists.post('/:playlistId/podcasts/', controller.addPodcast);
playlists.delete('/:playlistId/podcasts/:podcastId', controller.removePodcast);

module.exports = playlists;
