const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./station.controller');

const router = express.Router();

router.use(isAuthenticated);
router.get('/', controller.list);

router.get('/popular', controller.topFavorites);
router.get('/favorites', controller.topFavorites);

router.get('/:stationId/podcasts/', controller.listPodcasts);

module.exports = router;
