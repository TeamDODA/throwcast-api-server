const express = require('express');
const controller = require('./playlist.controller');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/*', controller.getOne);
router.post('/', controller.createList);
router.delete('/*', controller.deleteList);
router.post('/*', controller.addToList);
router.put('/*', controller.removeFromList);

module.exports = router;
