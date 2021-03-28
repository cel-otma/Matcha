const UImodel = require('../model/uinfos');
const Usersmodel = require('../model/users');
const rp = require('request-promise');
const publicIp = require('public-ip');

require('dotenv').config();

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}

let sendposition = async (userid) => {
    let clientip = await publicIp.v4();

    let data = await rp.get({
        uri : "http://www.geoplugin.net/json.gp?ip=" + clientip,
        json : true
    }).then(async (result) => {
        await require('../model/position').
        setposition(userid, result.geoplugin_latitude, result.geoplugin_longitude);
    });
}

exports.insertinfo = async (req, res) => {
    let dt = await require('../model/position').getposition(req.jwt.user_id);
    if (!data.length)
        await sendposition(req.jwt.user_id);
    req.body.user_id = req.jwt.user_id;
    let result = await UImodel.getUinfos(req.jwt.user_id);
    if (result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'Already have information !!'
        });
    result = await UImodel.insert_uinfos(req.body);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'You information is added successfully'
    });
}

let Changelocation = async (userid, city) => {
    await rp.get({
        uri : 'http://api.positionstack.com/v1/forward?access_key=d696007b4568b87117e5caa046366e5e&query=' + city,
        json: true
    }).then(async (result) => {
        if (result.data != undefined && result.data.length
        && result.data[0].longitude != null && result.data[0].latitude != null) {
            await require('../model/position').
            setposition(userid, result.data[0].latitude, result.data[0].longitude);
        }
    });
}



exports.updateinfo = async (req, res) => {
    var updated_columns = '';
    var vars = [];

    if (req.body.desc != undefined && req.body.desc != ""){
        updated_columns = "`desc`=?";
        vars.push(req.body.desc);
    }
    if (req.body.gendre != undefined && req.body.gendre != ""){
        updated_columns += (updated_columns == '') ? "`gendre`=?" : ', ' + "`gendre`=?";
        vars.push(req.body.gendre);
    }
    if (req.body.city != undefined && req.body.city != ""){
        updated_columns += (updated_columns == '') ? "`city`=?" : ', ' + "`city`=?";
        vars.push(req.body.city);
        Changelocation(req.jwt.user_id, req.body.city);
    }
    if (req.body.birthday != undefined && req.body.birthday != "") {
        updated_columns += (updated_columns == '') ? "`birthday`=?" : ', ' + "`birthday`=?";
        vars.push(req.body.birthday);
    }
    if (req.body.sexpref != undefined && req.body.sexpref != ""){
        updated_columns += (updated_columns == '') ? "`sex_pref`=?" : ', ' + "`sex_pref`=?";
        vars.push(req.body.sexpref);
    }
    if (updated_columns == '') {
        return (res.status(200).json({
            error : true,
            success : false,
            message : 'nothing to update'
        }));
    }
    vars.push(req.jwt.user_id);
    await UImodel.updatUinfos(vars, updated_columns);
    return (res.status(200).json({
        error : false,
        success : true,
        message : 'You\'re information is updated successfully'
    }));
}

exports.getuinfo = async (req, res) => {
    const {login} = req.query;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'no user specified'
        });
    let result = await Usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent login'
        });
    if (await is_blocked(req.jwt.user_id, result.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    let userid = result.data[0].user_id;
    result = await UImodel.getUinfosWhere('`user_id` = ?', [userid]);
    if (result.data.length)
        result.data[0].status = await require('../model/status').getstatus(userid);
    return res.status(200).json({
        error : false,
        success : true,
        data : result.data
    });
}