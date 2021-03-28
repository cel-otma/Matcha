const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const usersMWars = require('../middlewars/users')
const Authtoken = require('../jsonwt/authtoken.js');

router.post('/signin', require('../database/connection').connect, usersMWars.signin, usersController.signin);

router.post('/signup', require('../database/connection').connect, usersMWars.signup, usersController.signup);

router.post('/update/password', require('../database/connection').connect, Authtoken.authenticatetoken, usersMWars.updatePassword, usersController.updatePassword);

router.post('/reset/password', require('../database/connection').connect, usersMWars.resetPassword, usersController.resetPassword);

router.post('/changepasswd', require('../database/connection').connect, usersMWars.changePasswd, usersController.changePasswd);

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, usersController.get_infos);

router.patch('/', require('../database/connection').connect, Authtoken.authenticatetoken, usersMWars.updateAccount, usersController.updateAccount);

module.exports = router;