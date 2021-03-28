const express = require('express')
const router = express.Router()
const ratCtr = require('../controller/rating')
const Authtoken = require('../jsonwt/authtoken.js');

// login, rat , authorization
router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, ratCtr.postrating);

// login, authorization
router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, ratCtr.getrating);

// rating_id , authorization
router.delete('/', require('../database/connection').connect, Authtoken.authenticatetoken, ratCtr.delrating);

// login , rat , authorization
router.patch('/', require('../database/connection').connect, Authtoken.authenticatetoken, ratCtr.uprating);

module.exports = router;