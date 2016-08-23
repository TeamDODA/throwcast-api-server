const express = require('express');

const { sendJWTToken } = require('../auth.service');
const controller = require('./facebook.controller');

const router = express.Router();

router.get('/', controller.authRedirect);
router.get('/callback', controller.callbackAuth, sendJWTToken);
router.get('/token', controller.tokenAuth, sendJWTToken);

module.exports = router;
