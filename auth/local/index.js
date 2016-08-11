const express = require('express');

const controller = require('./local.controller');

const router = express.Router();

router.post('/', controller.auth);

module.exports = router;
