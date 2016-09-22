const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./user.controller');
const favoriteRouter = require('./favorite');
const playlistRouter = require('./playlist');

const users = express.Router();

/**
 * /api/users
 *
 * POST: Sign up a user
 */
users.post('/', controller.create);

/**
 * /api/users/me
 *
 * GET: Get authenticated user profile
 * @requires isAuthenticated
 */
users.get('/me', isAuthenticated, controller.me);

/**
 * /api/users/favorites
 *
 * GET: Get all favorites for authenticated user
 * @requires isAuthenticated
 */
users.use('/favorites', favoriteRouter);

/**
 * /api/users/playlists
 *
 * GET: Get all playlists for authenticated user
 * @requires isAuthenticated
 */
users.use('/playlists', playlistRouter);

module.exports = users;
