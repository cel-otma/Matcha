const UsersModel = require('../model/users');
const ConfirmMd = require('../model/confirm');

function loginisValide(login, status) {
    if (/[^a-zA-Z0-9]+/.test(login)) {
        if (status != null)
            status.error = "login contain invalid caractere";
        return (1);
    }
    if (login.length < 4) {
        if (status != null)
            status.error = "login is too short";
        return (1);
    }
    return (0);
}

function passwdisValide(passwd, status) {
    if (!/[A-Z]+/.test(passwd) || !/[a-z]+/.test(passwd)
    || !/[0-9]+/.test(passwd) || !/[\W]+/.test(passwd)) {
        if (status)
            status.error = "password must contain UpperCase, LowerCase, Numbers, Special Caractere";
        return (2);
    }
    if (passwd.length < 8) {
        if (status)
            status.error = "password must contain 8 caractere";
        return (1);
    }
    return (0);
}

function emailisValide(email, status) {
   if (!/^([A-Za-z0-9\.]+\@[A-Za-z0-9]+\.[A-Za-z0-9]+)$/.test(email)) {
       if (status != null) {
           status.error = "email has invalid format";
        }
        return (1);
   }
   return (0);
}

function fnameisValide(fname, status) {
    if (/[^A-Za-z]/.test(fname)) {
        if (status != null)
            status.error = "first name has invalid caractere";
        return (1);
    }
    return (0);
}

function lnameisValide(lname, status) {
    if (!/^([A-Za-z]+[\ ]{0,1}[A-Za-z]*)$/.test(lname)) {
        if (status != null)
            status.error = "last name has invalid caractere";
        return (1);
    }
    return (0);
}

async function loginisUnique(login, status) {
    var result = await UsersModel.getUsersWhere('`login` LIKE "' + login + '"', '`login`');
    if (result.error == true) {
        if (status != null)
            status.error = "something going wrong while fetching database";
        return (1);
    }
    if (result.data.length) {
        if (status != null)
            status.error = "login already used";
        return (1);
    }
    return (0);
}

async function emailisUnique(email, status) {
    var result = await UsersModel.getUsersWhere('`email` LIKE "' + email + '"', '`email`');
    if (result.error == true) {
        if (status != null)
            status.error = "something going wrong while fetching database";
        return (1);
    }
    if (result.data.length) {
        if (status != null)
            status.error = "email already used";
        return (1);
    }
    return (0);
}

function Dataisset(Data) {
    if (Data.fname == undefined
    || Data.lname == undefined
    || Data.login == undefined
    || Data.email == undefined
    || Data.passwd == undefined
    || Data.rpasswd == undefined)
        return (1);
    return (0);
}


async function checkData(Data, status) {
    if (Dataisset(Data)) {
        status.error = "some fields is empty !!";
        return (1);
    }

    if (fnameisValide(Data.fname, status)
    || lnameisValide(Data.lname, status)
    || emailisValide(Data.email, status)
    || loginisValide(Data.login, status)) {
        return (1);
    }
    let loginUnique = await loginisUnique(Data.login, status);
    if (loginUnique)
        return (1);
    let emailUnique = await emailisUnique(Data.email, status);
    if (emailUnique)
        return (1);
    if (Data.passwd != Data.rpasswd) {
        status.error = "passwords is different";
        return (1);
    }
    if (passwdisValide(Data.passwd, status)) {
        return (1);
    }
    return (0);
}

exports.signin = async (req, res, next) => {
    const login = req.body.login;
    const passwd = req.body.passwd;
    var status = {
        status : 200,
        error : "",
        success : true
    };

    if (login == undefined || passwd == undefined)
        return res.status(status.status).json({
            "error" : true,
            "message" : "some fields are empty !!",
            "success" : false
        });
    if (loginisValide(login, status) && emailisValide(login, null)) {
        return res.status(status.status).json({
            "error" : true,
            "message" : "login or password is incorrect",
            "success" : false
        });
    }
    if (passwdisValide(passwd, status)) {
        return res.status(status.status).json({
            "error" : true,
            "message" : "login or password is incorrect",
            "success" : false
        });
    }
    next();
}

exports.signup = async (req, res, next) => {
    const Data = req.body;
    var status = {
        error : "",
        status : 200
    };

    DataValide = await checkData(Data, status);
    if (DataValide) {
        return res.status(status.status).json({
            "error" : true,
            "message" : status.error,
            "success" : false
        });
    }
    next();
}

exports.updateAccount = async (req, res, next) => {
    if (req.body.login != undefined && req.body.login != ''
    && req.body.login != req.jwt.login && (loginisValide(req.body.login, null)
    || await loginisUnique(req.body.login, null)))
        return res.status(200).json({
            error : true,
            success : false,
            login : 'You\'ve invalide symbols on login fields or is already used'
        });
    if (req.body.email != undefined && req.body.email != ''
    && req.body.email != req.jwt.email && (emailisValide(req.body.email, null)
    || await emailisUnique(req.body.login, null)))
        return res.status(200).json({
            error : true,
            success : false,
            login : 'email format is invalid or is already used'
        });
    if (req.body.first_name != undefined && req.body.first_name != ''
    && req.body.first_name != req.jwt.first_name && fnameisValide(req.body.first_name, null))
        return res.status(200).json({
            error : true,
            success : false,
            login : 'firstname has invalid caractere'
        });
    if (req.body.last_name != undefined && req.body.last_name != ''
    && req.body.last_name != req.jwt.last_name && lnameisValide(req.body.last_name, null))
        return res.status(200).json({
            error : true,
            success : false,
            login : 'lastname has invalid caractere'
        });
    next();
}

exports.updatePassword = async (req, res, next) => {
    const {oldpasswd, npasswd, rpasswd} = req.body;
    let errnmr = 0;

    if (oldpasswd == undefined || passwdisValide(oldpasswd))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'old password is incorrect'
        });
    if (npasswd != rpasswd)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'password doesn\'t matched'
        });
    if (npasswd == undefined || (errnmr = passwdisValide(npasswd)))
        return res.status(200).json({
            error : true,
            success : false,
            message : (errnmr == 2) ? 'password must contain UpperCase, LowerCase, Numbers, Special Caractere' : 'password must contain 8 caractere'
        });
    next();
}

exports.resetPassword = async (req, res, next) => {
    let {email} = req.body;

    if (email == undefined || emailisValide(email))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'Invalide email'
        });
    next();
}

exports.changePasswd = async (req, res, next) => {
    const {login, key} = req.query;
    const {passwd, rpasswd} = req.body;

    if (login == undefined || key == undefined
        || passwd == undefined || rpasswd == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request'
        });
    if (loginisValide(login) || /[^\w]+/.test(key))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'invalid GET variable'
        });
    let errnmr;
    if ((errnmr = passwdisValide(passwd, null)))
        return res.status(200).json({
            error : true,
            success : false,
            message : (errnmr == 2) ? 'password must contain UpperCase, LowerCase, Numbers, Special Caractere' : 'password must contain 8 caractere'
        });
    if (passwd != rpasswd)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'passwords doesn\'t matched'
        });
    next();
}