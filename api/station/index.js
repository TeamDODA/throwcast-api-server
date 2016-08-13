const express = require('express');
const controller = require('./station.controller');

const router = express.Router();

router.get('/', controller.list);
router.get('/:stationId/podcasts/', controller.listPodcasts);

module.exports = router;
