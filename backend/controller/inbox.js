const inboxmodel = require('../model/inbox');
const usersmodel = require('../model/users');
const followmodel = require('../model/follow');
const imagesmodel = require('../model/images');
const userstatus = require('../model/status');

let is_matched = async (user1_id, user2_id) => {
    let result = await followmodel.getFollowersWhere('(`from_uid` = ? AND `to_uid` = ?) OR (`from_uid` = ? AND `to_uid` = ?)', [user1_id, user2_id, user2_id, user1_id]);
    if (result.data.length == 2)
        return (0);
    return 1;
}

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}

exports.postmsg = async (req, res) => {
    const {login, msg} = req.body;

    let data = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`',[login]);
    if (!data.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent login ' + login
        });
    if (await is_blocked(req.jwt.user_id, data.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    if (data.data[0].user_id == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t send message to yourself'
        });
    if (await is_matched(req.jwt.user_id, data.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You have to follow each others before send message'
        });
    await inboxmodel.postmsg(req.jwt.user_id, data.data[0].user_id, msg);
    return res.status(200).json({
        error : false,
        success : true,
        user_id : req.jwt.user_id,
        to_id : data.data[0].user_id
    });
}


exports.usersinbox = async (req, res) => {
    let columns = '`users`.`user_id`, `users`.`login`, `users`.`first_name`, `users`.`last_name`';
    let from = '`users`, `followers`';
    let where = '(`followers`.`from_uid` = ? AND `followers`.`to_uid` = `users`.`user_id`) ' + 
    'AND EXISTS (SELECT NULL FROM `followers` WHERE `to_uid` = ? AND `from_uid` = `users`.`user_id`) ' +
    'AND NOT EXISTS (SELECT NULL FROM `blocks` WHERE (`user_id` = ? AND `to_id` = `users`.`user_id`) OR (`user_id` = `users`.`user_id` AND `to_id` = ?))';
    const data = await inboxmodel
    .run_query(`select ${columns} from ${from} where ${where}`,
[req.jwt.user_id, req.jwt.user_id, req.jwt.user_id, req.jwt.user_id]);
    let i = 0;
    let new_data = [];
    while (i < data.length) {
        let images = await imagesmodel.getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT 1', [data[i].user_id]);
        data[i].img = (images.data.length) ? images.data[0].image_path : undefined;
        data[i].status = await userstatus.getstatus(data[i].user_id);
        i++;
    }
    res.json(data);
}

exports.getMessages = async (req, res) => {
    let {user_id, limit, g_msgid} = req.query;

    let where = '';
    limit = (limit == undefined || /[^0-9]+/.test(limit)) ?
    0 : limit;
    g_msgid = (g_msgid == undefined || /[^0-9]+/.test(g_msgid)) ?
    0 : g_msgid;
    if (user_id == 'NaN')
        return res.status(200).json({
            error : true,
            success : false,
            message : 'user id\'s not exist'
        });
    
    user_id = parseInt(user_id);
    let data = await usersmodel.getUsersWhere('`user_id` = ?', 'NULL' ,[user_id]);
    if (!data.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'user id\'s not exist'
        });
    if (await is_blocked(req.jwt.user_id, user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    if (await is_matched(req.jwt.user_id, user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You have to follow each others to access this action'
        });
    data = await inboxmodel.
    getMsgsWhere('((`user_id` = ? && `to_id` = ?) || (`user_id` = ? && `to_id` = ?)) AND `inbox_id` > ? ORDER BY `created_dat` ',
    [req.jwt.user_id, user_id, user_id, req.jwt.user_id, g_msgid]);
    let all_msg = await inboxmodel.
    run_query('SELECT COUNT(*) AS length FROM `inboxs` WHERE (`user_id` = ? && `to_id` = ?) || (`user_id` = ? && `to_id` = ?)', [req.jwt.user_id, user_id, user_id, req.jwt.user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        data : data,
        length : all_msg[0].length
    });
}