const express = require('express');
const router = express.Router();
const inboxmw = require('../middlewars/inbox');
const inboxcntr = require('../controller/inbox');
const Authtoken = require('../jsonwt/authtoken.js');

router.get('/users', require('../database/connection').connect, Authtoken.authenticatetoken, inboxmw.usersinbox, inboxcntr.usersinbox);

// user_id, authorization
router.get('/messages', require('../database/connection').connect, Authtoken.authenticatetoken, inboxmw.getMessages, inboxcntr.getMessages);

// msg, login, authorization
router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, inboxmw.postmsg, inboxcntr.postmsg);

module.exports = router;