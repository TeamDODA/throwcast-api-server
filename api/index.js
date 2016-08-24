const express = require('express');

const favorite = require('./favorite');
const playlist = require('./playlist');
const podcast = require('./podcast');
const station = require('./station');
const user = require('./user');

const router = express.Router();

router.use('/favorites', favorite);
router.use('/playlists', playlist);
router.use('/podcasts', podcast);
router.use('/stations', station);
router.use('/users', user);

module.exports = router;
