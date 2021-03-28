const express = require('express');
const router = express.Router();
const tagsmw = require('../middlewars/tags');
const tagscontroll = require('../controller/tags');
const Authtoken = require('../jsonwt/authtoken.js');

router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, tagsmw.insert_tags, tagscontroll.insert_tags);

router.patch('/', require('../database/connection').connect, Authtoken.authenticatetoken, tagsmw.update_tags, tagscontroll.update_tags);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, tagsmw.get_tags, tagscontroll.get_tags);

module.exports = router;