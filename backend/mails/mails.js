const nodemailer = require('nodemailer');
require('dotenv').config;
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASS
    }
});

const subject = {
    signup : 'Complete Registration',
    resetPasswd : 'Reset Password',
    changeEmail : 'Change email'
}

const text = {
    signup : 'Hello <fname> <lname>, Click on this link bellow to complete your registration : <br><a href="http://'
    + process.env.FRONT_HOST + ':' + process.env.FRONT_PORT + '/singin?login=<login>&key=<key>">CLICK-HERE</a>',
    changeEmail : 'Hello <fname> <lname>, Click on this link bellow to validate your new email : <br><a href="http://'
    + process.env.FRONT_HOST + ':' + process.env.FRONT_PORT + '/singin?login=<login>&key=<key>">CLICK-HERE</a>',
    resetPasswd : 'Hello <fname> <lname>, Click on this link bellow to choose inother password : <br><a href="http://'
    + process.env.FRONT_HOST + ':' + process.env.FRONT_PORT + '/newPassword?login=<login>&key=<key>">CLICK-HERE</a>'
}

exports.RegistrationEmail = (infos, key) => {
    var msg = text.signup;
    msg = msg.replace('<fname>', infos.fname);
    msg = msg.replace('<lname>', infos.lname);
    msg = msg.replace('<login>', infos.login);
    msg = msg.replace('<key>', key);

    transporter.sendMail({
        from : 'obouallam1337@gmail.com',
        to : infos.email,
        subject : subject.signup,
        html : msg
    }, (error, res) => {
    });
}

exports.validateEmail = (infos, key) => {
    var msg = text.changeEmail;
    msg = msg.replace('<fname>', infos.fname);
    msg = msg.replace('<lname>', infos.lname);
    msg = msg.replace('<login>', infos.login);
    msg = msg.replace('<key>', key);
    transporter.sendMail({
        from : 'obouallam1337@gmail.com',
        to : infos.email,
        subject : subject.changeEmail,
        html : msg
    }, (error, res) => {
    });
}

exports.resetPasswd = (infos, key) => {
    var msg = text.resetPasswd;
    msg = msg.replace('<fname>', infos.fname);
    msg = msg.replace('<lname>', infos.lname);
    msg = msg.replace('<login>', infos.login);
    msg = msg.replace('<key>', key);
    transporter.sendMail({
        from : 'obouallam1337@gmail.com',
        to : infos.email,
        subject : subject.resetPasswd,
        html : msg
    }, (error, res) => {
    });
}