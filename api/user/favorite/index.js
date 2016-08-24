const express = require('express');

const { isAuthenticated } = require('../../../auth/auth.service');
const controller = require('./favorite.controller');

const favorite = express.Router();

favorite.use(isAuthenticated);
favorite.get('/', controller.favorites);

module.exports = favorite;
