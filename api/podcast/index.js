const express = require('express');
const controller = require('./podcast.controller');

const router = express.Router();

router.get('/', controller.list);

module.exports = router;
