const express = require('express');
const controller = require('./favorite.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { isFavoriteOwner } = require('./favorite.auth');

const favorite = express.Router();

favorite.use(isAuthenticated);

favorite.post('/', controller.create);
favorite.delete('/:favoriteId', isFavoriteOwner, controller.remove);

module.exports = favorite;
