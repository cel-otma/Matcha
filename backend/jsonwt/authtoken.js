const jwt = require('jsonwebtoken');
const usersmodel = require('../model/users');
require('dotenv').config();


exports.authenticatetoken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (token == undefined || token == null)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You need to login first'
        });
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
        if (err)
            return res.status(200).json({
                error : true,
                success : false,
                message : 'You need to login first !!'
            });
        let result = await usersmodel.getUsersWhere('(`user_id` = ? AND `login` = ? AND `first_name` = ? AND `last_name` = ? AND `email` = ?)', '`user_id`',
        [data.user_id, data.login, data.first_name, data.last_name, data.email]);
        if (!result.data.length)
            return res.status(200).json({
                error : true,
                success : false,
                message : 'this user does not exist'
            });
        req.jwt = data;
        next();
    });
}