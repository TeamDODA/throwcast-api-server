const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./podcast.controller');

const router = express.Router();

router.use(isAuthenticated);
router.get('/', controller.recent);

router.get('/favorites', controller.topFavorites);

module.exports = router;
