const express = require('express');

const controller = require('./user.controller');

const router = express.Router();

router.post('/', controller.create);
router.post('/:userId/queues/', controller.addQueue);
router.post('/:userId/subscriptions/', controller.addStation);
router.delete('/:userId/queues/:podcastId', controller.deleteQueue);
router.delete('/:userId/subscriptions/:stationId', controller.deleteStation);

module.exports = router;
