const express = require('express');
const router = express.Router();
const followsmw = require('../middlewars/follow');
const followcntr = require('../controller/follow');
const Authtoken = require('../jsonwt/authtoken.js');

router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, followsmw.postFollow, followcntr.postFollow);

router.get('/all', require('../database/connection').connect, Authtoken.authenticatetoken, followsmw.getAllFollowers, followcntr.getAllFollowers);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, followsmw.getFollowersWhere, followcntr.getFollowersWhere);

router.get('/following', require('../database/connection').connect, Authtoken.authenticatetoken, followsmw.getFollowing, followcntr.getFollowing);


module.exports = router;