const express = require('express');
const controller = require('./station.controller');

const router = express.Router();

router.get('/', controller.list);

module.exports = router;
