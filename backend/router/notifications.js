const express = require('express');
const router = express.Router();
const ntsmw = require('../middlewars/notifications');
const ntscntr = require('../controller/notifications');
const Authtoken = require('../jsonwt/authtoken.js');

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, ntscntr.getntfs);

router.delete('/', require('../database/connection').connect, Authtoken.authenticatetoken, ntsmw.deleteNtfs, ntscntr.deleteNtfs);

router.get('/vue', require('../database/connection').connect, Authtoken.authenticatetoken, ntscntr.vu_ntfs);

module.exports = router;