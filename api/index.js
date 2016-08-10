const express = require('express');
const station = require('./station');

const router = express.Router();

router.use('/stations', station);

module.exports = router;
