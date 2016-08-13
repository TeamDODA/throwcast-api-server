const express = require('express');
const controller = require('./playlist.controller');

const router = express.Router();

router.get('/', controller.lists);
router.post('/', controller.create);
router.get('/:playlistId', controller.show);
router.delete('/:playlistId', controller.delete);
router.post('/:playlistId/podcasts/', controller.addPodcast);
router.delete('/:playlistId/podcasts/:podcastId', controller.removePodcast);

module.exports = router;
