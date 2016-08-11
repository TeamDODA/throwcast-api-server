const express = require('express');

const podcast = require('./podcast');
const station = require('./station');
const user = require('./user');

const router = express.Router();

router.use('/podcasts', podcast);
router.use('/stations', station);
router.use('/users', user);

module.exports = router;
