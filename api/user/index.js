const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./user.controller');
const subscriptionRouter = require('./subscription');

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

users.use('/subscriptions', subscriptionRouter);

module.exports = users;
