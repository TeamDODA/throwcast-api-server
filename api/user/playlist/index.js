const express = require('express');

const { isAuthenticated } = require('../../../auth/auth.service');
const controller = require('./playlist.controller');

const playlist = express.Router();

playlist.use(isAuthenticated);
playlist.get('/', controller.list);

module.exports = playlist;
