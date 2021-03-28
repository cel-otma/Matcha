const express = require('express')
const router = express.Router()
const confController = require('../controller/confirm');
const confMw = require('../middlewars/confirm');

router.get('/', require('../database/connection').connect, confMw.confirm, confController.confirm);

module.exports = router;