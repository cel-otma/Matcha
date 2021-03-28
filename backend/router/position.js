const express = require('express')
const router = express.Router()
const posCtr = require('../controller/position');
const posmw = require('../middlewars/position');
const Authtoken = require('../jsonwt/authtoken.js');
const { route } = require('./tags');

// lat, lon, authorization
router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, posmw.setposition, posCtr.setposition);

// authorization, login
router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, posCtr.getposition);

// authorization
router.delete('/', require('../database/connection').connect, Authtoken.authenticatetoken, posCtr.delposition);

module.exports = router;