const usersinfo = require('../model/uinfos');
const users = require('../model/users');
const usersimages = require('../model/images');
// const usersimages = require('../model/images');

exports.getProfile = async (req, res, next) => {
    const login = req.query;

    if (login == undefined || login == '')
        return res.status(200).json({
            success : false,
            error : true,
            message : 'must define a login'
        });
    next();
}