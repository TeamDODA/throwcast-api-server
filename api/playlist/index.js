const express = require('express');
const controller = require('./playlist.controller');

const playlists = express.Router();

playlists.get('/', controller.lists);
playlists.post('/', controller.create);
playlists.get('/:playlistId', controller.show);
playlists.delete('/:playlistId', controller.delete);
playlists.post('/:playlistId/podcasts/', controller.addPodcast);
playlists.delete('/:playlistId/podcasts/:podcastId', controller.removePodcast);

module.exports = playlists;
