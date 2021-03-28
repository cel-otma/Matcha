const infosModel = require('../model/uinfos');


function gendreIsvalide(gendre) {
    if (gendre > 0 && gendre < 3)
        return (0);
    return (1);
}

function cityIsvalide(city) {
    if (/[^A-Za-z\s\W]+/.test(city) || city == '')
        return (1);
    return (0);
}

function descIsvalide(desc) {
    if (!desc.length)
        return (1);
    return (0);
}

function    dataIset(body) {
    if (body.city != undefined && body.desc != undefined &&
        body.birthday != undefined && body.gendre != undefined
        && body.sexpref != undefined)
        return (0);
    return (1);
}

function    bdayISvalide(birthday) {
    if (!/^([0-9]{2}[\-]{1}[0-9]{2}[\-]{1}[0-9]{4})$/.test(birthday)
    && !/^([0-9]{4}[\-]{1}[0-9]{2}[\-]{1}[0-9]{2})$/.test(birthday))
        return (1);
    return (0);
}

function    sexprefIsvalide(sexpref) {
    if (sexpref > 0 && sexpref <= 3)
        return (0);
    return (1);
}

exports.insertinfo = async (req, res, next) => {
    if (dataIset(req.body))
        return res.status(200).json({
            error : true,
            success : false,
            message : "missing fields"
        });
    if (sexprefIsvalide(req.body.sexpref))
        return res.status(200).json({
            error : true,
            success : false,
            message : "Invalide Sexual preferences"
        });
    if (gendreIsvalide(req.body.gendre))
        return res.status(200).json({
            error : true,
            success : false,
            message : "Invalide gendre !!"
        });
    if (descIsvalide(req.body.desc))
        return res.status(200).json({
            error : true,
            success : false,
            message : "Invalid description !!"
        });
    if (cityIsvalide(req.body.city))
        return res.status(200).json({
            error : true,
            success : false,
            message : "Invalid city !!"
        });
    if (bdayISvalide(req.body.birthday))
        return res.status(200).json({
            error : true,
            success : false,
            message : "Birthday has invalid character !!"
        });
    next();
}

let InfosExists = async (userid) => {
    let result = await infosModel.getUinfos(userid);
    if (!result.data.length)
        return (1);
    return (0);
}

exports.updateinfo = async (req, res, next) => {
    if (await InfosExists(req.jwt.user_id))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'You don\'t have information yet !!'
        }));
    if (req.body.desc != undefined
        && req.body.desc != '' && descIsvalide(req.body.desc))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'invalid description'
        }));
    if (req.body.birthday != undefined
        && req.body.birthday != '' && bdayISvalide(req.body.birthday))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'invalid birthday'
        }));
    if (req.body.gendre != undefined
        && req.body.gendre != '' && gendreIsvalide(req.body.gendre))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'invalid gendre'
        }));
    if (req.body.city != undefined
        && req.body.city != '' && cityIsvalide(req.body.city))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'invalid city'
        }));
    if (req.body.sexpref != undefined
        && req.body.sexpref != '' && sexprefIsvalide(req.body.sexpref))
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'invalid Sexual preferences'
        }));
    next();
}