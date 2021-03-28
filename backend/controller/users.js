const UsersModel = require('../model/users');
const ConfModel = require('../model/confirm');
const randomString = require('randomstring');
const mail = require('../mails/mails');
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
require('dotenv').config();
const columns = '`user_id`, `first_name`, `last_name`, `login`';

async function isConfirmed(user_id) {
    let res2 = await ConfModel.getConfWhere('`user_id` = ?', [user_id]);
    if (res2.data.length && res2.data[0].con_type != 'ResetPasswd')
        return (1);
    else if (res2.data.length)
        await ConfModel.dropConf(res2.data[0].con_id);
    return (0);
}

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}

async function LoginisExist(login) {
    let result = await UsersModel.getUsersWhere('`login` LIKE ?', columns, [login]);
    return (result);
}

exports.signin = async (req, res) => {
    let result = await LoginisExist(req.body.login);
    if (!result.data.length)
        return res.status(200).json({
            'error' : true,
            'success' : false,
            'message' : 'login or password incorrect !!'
        });
    if (await isConfirmed(result.data[0].user_id)) {
        return res.status(200).json({
            'error' : true,
            'success' : false,
            'message' : "You have to confirm your account"
        });
    }
    result = await UsersModel.getUsersWhere('`login` LIKE ?', columns + ', `passwd`, `email`', [req.body.login]);
    bcrypt.compare(req.body.passwd, result.data[0].passwd, (err, succ) => {
        if (succ) {
            const accessToken = jsonwt.sign({login : result.data[0].login, email : result.data[0].email,
            user_id : result.data[0].user_id, first_name : result.data[0].first_name, last_name : result.data[0].last_name}, process.env.TOKEN_SECRET);
            return res.status(200).json({
                'error' : false,
                'success' : true,
                'token' : accessToken
            });
        }
        else
            return res.status(200).json({
                'error' : true,
                'success' : false,
                'message' : 'login or password incorrect !!'
            });
    });
    return ;
}

async function generateValKey() {
    var key = '';
    var res;
    while (1) {
        key = randomString.generate({
            length : 10,
            charset : 'alphanumeric'
        });
        res = await ConfModel.getConfWhere('`con_key` LIKE ?', [key]);
        if (!res.data.length)
            break ;
    }
    return (key);
}

exports.signup = async (req, res) => {
    const {fname, lname, email} = req.body;
    result = await UsersModel.InsertUsers(req.body);
    var key = await generateValKey();
    res2 = await ConfModel.CreateConf({
        con_key : key,
        user_id : result.data[0].user_id,
        con_type : 1
    });
    mail.RegistrationEmail(req.body, key);
    return res.status(200).json({
        success : true,
        error : false,
        message : "Your account is created successfully"
    });
}

exports.get_infos = async (req, res) => {
    const {login} = req.query;

    if (login == undefined || login == ''
    || /[^A-Za-z0-9]+/.test(login))
        return res.status(200).json({
            success : false,
            error : true,
            message : 'inexistent login'
        });
    let result = await LoginisExist(req.query.login);
    if (!result.data.length)
        return res.status(200).json({
            success : false,
            error : true,
            message : 'inexistent login'
        });
    if (await is_blocked(req.jwt.user_id, result.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    let clmns = columns;
    clmns += (result.data[0].user_id == req.jwt.user_id) ? ', `email`' : '';
    result = await UsersModel.getUsersWhere('`user_id` = ?', clmns, [result.data[0].user_id]);
    return res.status(200).json({
        success : true,
        error : false,
        data : result.data
    });
}

exports.updateAccount = async (req, res) => {
    let update_columns = '';
    let vars = [];
    if (req.body.login != undefined && req.body.login != ''
    && req.body.login != req.jwt.login) {
        update_columns = '`login`=?';
        vars.push(req.body.login);
    }
    if (req.body.email != undefined && req.body.email != ''
    && req.body.email != req.jwt.email) {
        update_columns += (update_columns == '') ? '`email`=?' : ', `email`=?';
        vars.push(req.body.email);
    }
    if (req.body.first_name != undefined && req.body.first_name != ''
    && req.body.first_name != req.jwt.first_name) {
        update_columns += (update_columns == '') ? '`first_name`=?' : ', `first_name`=?';
        vars.push(req.body.first_name);
    }
    if (req.body.last_name != undefined && req.body.last_name != ''
    && req.body.last_name != req.jwt.last_name) {
        update_columns += (update_columns == '') ? '`last_name`=?' : ', `last_name`=?';
        vars.push(req.body.last_name);
    }
    if (update_columns == '')
        return (res.status(200).json({
            error : false,
            success : true,
            message : 'nothing to update'
        }));
    vars.push(req.jwt.user_id);
    await UsersModel.updateAccount(update_columns, vars);
    if (update_columns.search('email') > -1) {
        const result = await ConfModel.getConfWhere('`user_id` = ?', [req.jwt.user_id]);
        if (!result.data.length) {
            const key = await generateValKey();
            await ConfModel.CreateConf({con_key : key, user_id : req.jwt.user_id, con_type : 2});
            mail.validateEmail({fname : req.jwt.first_name,
            lname : req.jwt.first_name, login : req.jwt.login, email : req.body.email}, key);
        }
    }
    return (res.status(200).json({
        error : false,
        success : true,
        message : 'You\'re information is updated successfully'
    }));
}

exports.changePasswd = async (req, res) => {
    const {login, key} = req.query;
    const {passwd, rpasswd} = req.body;

    let result = await LoginisExist(login);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent login'
        });
    const user_id = result.data[0].user_id;
    result = await ConfModel.getConfWhere('`user_id` = ? AND `con_key` = ? AND `con_type` = 3', [user_id, key]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent key'
        });
    await ConfModel.dropConf(result.data[0].con_id);
    await UsersModel.updateAccount('`passwd`=?', [bcrypt.hashSync(passwd, 10), user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'Your password is updated successfully'
    });
}

exports.updatePassword = async (req, res) => {
    let result = await UsersModel.getUsersWhere('`user_id` = ?', '`passwd`', [req.jwt.user_id]);
    bcrypt.compare(req.body.oldpasswd, result.data[0].passwd, async (err, succ) => {
        if (succ) {
            await UsersModel.updateAccount('`passwd`=?', [bcrypt.hashSync(req.body.npasswd, 10), req.jwt.user_id]);
            return res.status(200).json({
                error : false,
                success : true,
                message : 'Your password is updated successfully'
            })
        }
        return res.status(200).json({
            error : true,
            success : false,
            message : 'old password is incorrect'
        })
    });
    return ;
}

exports.resetPassword = async (req, res) => {
    let {email} = req.body;

    let result = await UsersModel.getUsersWhere('`email` LIKE ?', '`login`, `user_id`, `first_name`, `last_name`', [email]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'email\'s inexistent'
        });
    let {user_id, first_name, last_name, login}  = result.data[0];
    result = await ConfModel.getConfWhere('`user_id` LIKE ?', [user_id]);
    if (result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'fetch your email, already send a validation url of ' + result.data[0].con_type
        });
    let key = await generateValKey();
    await ConfModel.CreateConf({user_id : user_id, con_key : key, con_type : 3});
    mail.resetPasswd({login : login, lname : last_name, fname : first_name, email : email}, key);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'check your email'
    });
}