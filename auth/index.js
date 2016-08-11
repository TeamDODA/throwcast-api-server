const express = require('express');

const local = require('./local');

const router = express.Router();

router.use('/local', local);

module.exports = router;
