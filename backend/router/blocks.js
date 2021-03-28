const express = require('express')
const router = express.Router()
const blocksctr = require('../controller/blocks');
const Authtoken = require('../jsonwt/authtoken.js');


//just authorization
router.get('/calc', require('../database/connection').connect, Authtoken.authenticatetoken, blocksctr.calcBlocked);

//just authorization
router.get('/get', require('../database/connection').connect, Authtoken.authenticatetoken, blocksctr.getBlocked);

//login authorization
router.delete('/',require('../database/connection').connect,  Authtoken.authenticatetoken, blocksctr.deleteBlocked);

//login authorization 
router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, blocksctr.blockUser);


module.exports = router;