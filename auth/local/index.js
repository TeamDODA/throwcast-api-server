const express = require('express');

const { sendJWTToken } = require('../auth.service');
const controller = require('./local.controller');

const router = express.Router();

router.post('/', controller.auth, sendJWTToken);

module.exports = router;
