const express = require('express');
const router = express.Router();
const reportcntr = require('../controller/report');
const Authtoken = require('../jsonwt/authtoken.js');

// data : user_id currently we handle one report (FAKEACCOUNT)
// login
router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, reportcntr.reportUser);

// data : login
router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, reportcntr.getreported);

module.exports = router;