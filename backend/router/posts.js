const express = require('express')
const router = express.Router()
const postCtr = require('../controller/posts')
const postMWars = require('../middlewars/posts')
const Authtoken = require('../jsonwt/authtoken.js');

router.get('/', require('../database/connection').connect,
Authtoken.authenticatetoken, postMWars.getPosts, postCtr.getPosts);

module.exports = router;