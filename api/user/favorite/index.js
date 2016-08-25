const express = require('express');

const { isAuthenticated } = require('../../../auth/auth.service');
const controller = require('./favorite.controller');

const favorite = express.Router();

favorite.use(isAuthenticated);
favorite.get('/', controller.favorites);
favorite.delete('/:from/:localField', controller.remove);

module.exports = favorite;
