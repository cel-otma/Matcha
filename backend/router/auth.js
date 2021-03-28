const express = require('express');
const router = express.Router();
const Authtoken = require('../jsonwt/authtoken.js');

router.get('/', require('../database/connection').connect, Authtoken.authenticatetoken, (req, res) => {
    res.status(200).json({
        error : false,
        success : true,
        message : 'Is a valide authorization'
    });
});

module.exports = router;