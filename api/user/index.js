const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./user.controller');

const users = express.Router();

/**
 * /api/users
 *
 * POST: Sign up a user
 */
users.post('/', controller.create);

/**
 * /api/users/subscriptions
 *
 * POST: Add station to user's subscriptions
 * DELETE: Remove station from user's subscriptions
 * @requires isAuthenticated
 */
users.post('/subscriptions', isAuthenticated, controller.subscribe);
users.delete('/subscriptions/:stationId', isAuthenticated, controller.unsubscribe);

/**
 * /api/users/me
 *
 * GET: Get authenticated user profile
 * @requires isAuthenticated
 */
users.get('/me', isAuthenticated, controller.me);

module.exports = users;
