const followmodel = require('../model/follow');
const usersmodel = require('../model/users');

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}

let AddtoHistory = async (userid, login, flag) => {
    let message = `You've ` + ((flag) ? 'follow ' : 'unfollow ')   + `${login}`;

    await require('../model/history').inserttoHistory(userid, message);
    return true;
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

exports.postFollow = async (req, res) => {
    const {to_login} = req.body;

    let result = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [to_login]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    if (req.jwt.user_id == result.data[0].user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you can\'t follow yourself'
        });
    if (await is_blocked(req.jwt.user_id, result.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    if (await isCompletedProfil(req.jwt.user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you must have at least one picture And ' +
            'one active tags And complete your information to access this action'
        });
    let data = await followmodel.
    getFollowersWhere('`from_uid` = ? AND `to_uid` = ?', [req.jwt.user_id, result.data[0].user_id]);
    await followmodel.postFollow(req.jwt.user_id, result.data[0].user_id);
    await AddtoHistory(req.jwt.user_id, to_login,
    (data.data.length) ? 0 : 1);
    return res.status(200).json({
        error : false,
        success : true,
        message : (data.data.length) ? 'Follow deleted successfully' : 'Follow added successfully'
    });
}

exports.getAllFollowers = async (req, res) => {
    const {login} = req.query;

    let result = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    result = await followmodel.getAllFollowers(result.data[0].user_id);
    return res.status(200).json({
        error : false,
        success : true,
        data : result.data.length
    });
}

exports.getFollowersWhere = async (req, res) => {
    const {to_login} = req.query;

    let result = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [to_login]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    result = await followmodel.getFollowersWhere('`to_uid` = ? AND `from_uid` = ?', [result.data[0].user_id, req.jwt.user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        data : result.data.length
    });
}

exports.getFollowing = async (req, res) => {
    const {login} = req.query;

    let result = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    result = await followmodel.getFollowersWhere('`from_uid` = ?', [result.data[0].user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        data : result.data.length
    });
}