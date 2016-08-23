const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./podcast.controller');

const router = express.Router();

router.get('/', isAuthenticated, controller.list);

module.exports = router;
