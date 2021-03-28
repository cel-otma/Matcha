const express = require('express');
const router = express.Router();
const infosContr = require('../controller/uinfos');
const infosMWars = require('../middlewars/uinfos');
const Authtoken = require('../jsonwt/authtoken.js');

router.post('/', require('../database/connection').connect, Authtoken.authenticatetoken, infosMWars.insertinfo, infosContr.insertinfo);

router.patch('/', require('../database/connection').connect, Authtoken.authenticatetoken, infosMWars.updateinfo, infosContr.updateinfo);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, infosContr.getuinfo);

module.exports = router;