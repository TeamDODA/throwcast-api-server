const express = require('express');

const podcast = require('./podcast');
const station = require('./station');
const user = require('./user');
const playlist = require('./playlist');

const router = express.Router();

router.use('/podcasts', podcast);
router.use('/stations', station);
router.use('/users', user);
router.use('/playlists', playlist);

module.exports = router;
