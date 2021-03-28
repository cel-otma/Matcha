let reportmodel = require('../model/report');
let usersmodel = require('../model/users');


UserIsexist = async (user_id, login) => {
    let where = (login !== undefined) ? '`login` LIKE ?' : '`user_id` = ?';
    let vars = [(login !== undefined) ? login : user_id];
    let data = await usersmodel.getUsersWhere(where + ' LIMIT 1', 'NULL', vars);
    if (!data.data.length)
        return 1
    return 0;
}

exports.reportUser = async (req, res) => {
    if (req.body.login == undefined
        || /[^a-zA-Z0-9]+/.test(req.body.login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assignd a valide user login'
        });
    let {login} = req.body;
    if (await UserIsexist(null, login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'login can\'t be found'
        });
    let data = await usersmodel.getUsersWhere('`login` LIKE ? LIMIT 1', '`user_id`', [login]);
    let user_id = data.data[0].user_id;
    if (user_id == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t report youself'
        });
    data = await reportmodel.getreportWhere
    ('`user_id` = ? AND `to_id` = ?', '`rep_id`', [req.jwt.user_id, user_id]);
    if (data.length)
        await reportmodel.deletereport(data[0].rep_id);
    else
        await reportmodel.insertreport([[[req.jwt.user_id, user_id, 1]]]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'your report is successfully ' + ((data.length) ? 'deleted' : 'added')
    });
}

exports.getreported = async (req, res) => {
    if (req.query.login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assignd a login'
        });
    let {login} = req.query;
    if (/[^a-zA-Z0-9]+/.test(req.query.login) ||
    await UserIsexist(0, login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'login can\'t be found'
        });
    let userid = await usersmodel.getUsersWhere('`login` LIKE ? LIMIT 1', '`user_id`', [login]);
    userid = userid.data[0].user_id;   
    let data = await reportmodel.getreportWhere('`to_id` = ?', 'COUNT(*) AS length', [userid]);
    let urep = await reportmodel.getreportWhere('`to_id` = ? AND `user_id` = ?', '`rep_id`', [userid, req.jwt.user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        length : data[0].length,
        ureport : ((urep.length) ? 1 : 0)
    });
}