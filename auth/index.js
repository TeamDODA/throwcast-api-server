const express = require('express');

const local = require('./local');
const facebook = require('./facebook');

const router = express.Router();

router.use('/local', local);
router.use('/facebook', facebook);

module.exports = router;
