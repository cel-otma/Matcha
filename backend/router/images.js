const express = require('express');
const router = express.Router();
const imgsmw = require('../middlewars/images');
const imgscntr = require('../controller/images');
const Authtoken = require('../jsonwt/authtoken.js');

router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, imgsmw.insert_img, imgscntr.insert_img);

router.delete('/', require('../database/connection').connect, Authtoken.authenticatetoken, imgsmw.delete_img, imgscntr.delete_img);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, imgscntr.get_imgs);

module.exports = router;