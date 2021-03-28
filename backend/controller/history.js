const hismodel = require('../model/history');
const usersmodel = require('../model/users');
const imagesmodel = require('../model/images');

let notifotheruser = async (from_id, to_id, login) => {
    let message = 'Your profile has been checked by ' + login;

    await require('../model/notifications').insertntfs(to_id, from_id, message, 'Visit');
    return true;
}

exports.posthistory = async (req, res) => {
    let {login} = req.body;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assign a login data'
        });
    if (/[^A-Za-z0-9]+/.test(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent login ' + login
        });
    let data = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`',[login]);
    if (!data.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent login ' + login
        });
    if (data.data[0].user_id == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'this is your profile -_-'
        });
    await hismodel.inserttoHistory(req.jwt.user_id, `You have visit ${login} profile`);
    await notifotheruser(req.jwt.user_id, data.data[0].user_id, req.jwt.login);
    return res.status(200).json({
        error : false,
        success : true
    });
}


let getUimg = async (userid) => {
    let dt = await imagesmodel.getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT 1', [userid]);
    return (dt.data.length) ? dt.data[0].image_path : undefined;
}

let getuinfos = async (userid) => {
    let dt = await usersmodel.getUsersWhere('`user_id` = ?', '`login`, `first_name`, `last_name`',[userid]);
    return dt.data[0];
}

exports.gethistory = async (req, res) => {
    let limit = req.query.limit || 0;

    let data = await hismodel.getHistoryWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT ' + limit + ', 10', '*', [req.jwt.user_id]);
    let length = await hismodel.getHistoryWhere('`user_id` = ?', 'COUNT(*) AS length', [req.jwt.user_id]);
    let i = 0;
    while (i < data.length) {
        data[i].image = await getUimg(data[i].user_id);
        data[i].infos = await getuinfos(data[i].user_id);
        i++;
    }
    length = (length[0] != undefined) ? length[0].length : 0;
    return res.json({
        length : length,
        data : data
    });
}

exports.delhistory = async (req, res) => {
    let {history_id} = req.body;

    if (history_id == undefined
        || /[^0-9]+/.test(history_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent id'
        });
    let data = await hismodel.getHistoryWhere('`history_id` = ?', '*', [history_id]);
    if (!data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent id'
        });
    await hismodel.deleteHistory(history_id);
    return res.json({
        success : true,
        error : false,
        message : 'History deleted successfully'
    });
}