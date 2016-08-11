const express = require('express');

const podcast = require('./podcast');
const station = require('./station');

const router = express.Router();

router.use('/podcasts', podcast);
router.use('/stations', station);

module.exports = router;
