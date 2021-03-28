const ratmodel = require('../model/rating');
const usermodel = require('../model/users');

let loginisexist = async (login) => {
    let data = await usermodel.getUsersWhere('`login` LIKE ?', 'NULL', [login]);
    if (!data.data.length)
        return 1;
    return 0;
}

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}

let isCompletedProfil = async (userid) => {
    let data = await require('../model/uinfos').getUinfosWhere('`user_id` = ? LIMIT 1', [userid]);
    if (!data.data.length)
        return 1;
    data =  await require('../model/images').getImgsWhere('`user_id` = ? LIMIT 1', [userid]);
    if (!data.data.length)
        return 1;
    data = await require('../model/tags').gettags_where('(`user_id` = ? AND `state` = 1) LIMIT 1', 'NULL', [userid]);
    if (!data.data.length)
        return 1;
    return 0;
}

exports.postrating = async (req, res) => {
    const {login, rat} = req.body;

    if (login == undefined || rat == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'missing data'
        });
    if (await loginisexist(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexist login'
        });
    if (rat > 5 || rat <= 0)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'invalid rating'
        });
    let data = await usermodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (data.data[0].user_id == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t get rating your self'
        });
    if (await is_blocked(req.jwt.user_id, data.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    if (await isCompletedProfil(req.jwt.user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you must have at least one picture And '+
            'one active tags And complete your information to access this action'
        });
    let to_uid = data.data[0].user_id;
    data = await ratmodel.get_rating('`to_uid` = ? AND `from_uid` = ?', 'NULL', [to_uid, req.jwt.user_id]);
    if (data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'already rated'
        });
    await ratmodel.postrating(to_uid, req.jwt.user_id, rat);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'rating added successfully'
    });
}

exports.getrating = async (req, res) => {
    const {login} = req.query;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'missing data'
        });
    if (await loginisexist(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexist login'
        });
    let data = await usermodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    let to_id = data.data[0].user_id;
    data = await ratmodel.calc_rating(to_id);
    let userrat = await ratmodel.get_rating('`to_uid` = ? AND `from_uid` = ?', '`rat_nbr`', [to_id, req.jwt.user_id]);
    let totalrat = await ratmodel.get_rating('`to_uid` = ?', '`rat_nbr`', [to_id]);
    return res.status(200).json({
        error : false,
        success : true,
        rating : (data[0].rating != null) ? data[0].rating : 0,
        userrat : (userrat.length) ? parseInt(userrat[0].rat_nbr) : 0,
        totalrat : (totalrat.length) ? totalrat.length : 0
    });
}

exports.delrating = async (req, res) => {
    const {rating_id} = req.body;

    if (rating_id == undefined || /[^0-9]+/.test(rating_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'invalide id'
        });
    let data = await ratmodel.get_rating('`rat_id` = ? AND `from_uid` = ?', 'NULL', [rating_id, req.jwt.user_id]);
    if (!data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent id'
        });
    await ratmodel.delrating(rating_id);
    return res.status(200).json({
        error : true,
        success : false,
        message : 'deleted successfully'
    });
}

exports.uprating = async (req, res) => {
    const {login, rat} = req.body;

    if (login == undefined || rat == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'missing data'
        });
    if (await loginisexist(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexist login'
        });
    if (rat > 5 || rat < 0)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'invalid rating'
        });
    let data = await usermodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (data.data[0].user_id == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t get rating your self'
        });
    if (await isCompletedProfil(req.jwt.user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you must have at least one picture And '+
            'one active tags And complete your information to access this action'
        });
    let to_uid = data.data[0].user_id;
    data = await ratmodel.get_rating('`to_uid` = ? AND `from_uid` = ?', 'NULL', [to_uid, req.jwt.user_id]);
    if (!data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent rating'
        });
    await ratmodel.uprating('`rat_nbr`=?', '`from_uid`=? AND `to_uid`=?',
    [rat, req.jwt.user_id, to_uid]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'rating updated successfully'
    });
}