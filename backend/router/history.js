const express = require('express');
const router = express.Router();
const historycntr = require('../controller/history');
const Authtoken = require('../jsonwt/authtoken.js');

// => login
router.post('/visit', require('../database/connection').connect, Authtoken.authenticatetoken, historycntr.posthistory);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, historycntr.gethistory);

// history_id
router.delete('/', require('../database/connection').connect, Authtoken.authenticatetoken, historycntr.delhistory)

module.exports = router;