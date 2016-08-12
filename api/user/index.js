const express = require('express');

const { isAuthenticated } = require('../../auth/auth.service');
const controller = require('./user.controller');

const router = express.Router();

router.post('/', controller.create);
router.post('/:userId/queues/', controller.addQueue);
router.post('/:userId/subscriptions/', controller.addStation);
router.delete('/:userId/queues/:podcastId', controller.deleteQueue);
router.delete('/:userId/subscriptions/:stationId', controller.deleteStation);

router.get('/me', isAuthenticated, controller.me);

module.exports = router;
