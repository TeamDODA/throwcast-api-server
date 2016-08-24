const express = require('express');

const { isAuthenticated } = require('../../../auth/auth.service');
const controller = require('./subscription.controller');

const subscription = express.Router();

/**
 * /api/users/subscriptions
 *
 * PUT: update a user's subscriptions
 * @requires isAuthenticated
 */
subscription.put('/', isAuthenticated, controller.update);

module.exports = subscription;
