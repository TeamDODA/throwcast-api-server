const express = require('express');

const { isAuthenticated } = require('../../../auth/auth.service');
const controller = require('./subscription.controller');

const subscriptions = express.Router();

/**
 * /api/users/subscriptions
 *
 * PUT: update a user's subscriptions
 * @requires isAuthenticated
 */
subscriptions.put('/', isAuthenticated, controller.update);

module.exports = subscriptions;
