let blocksmodel = require('../model/blocks');
let usersmodel = require('../model/users');

UserIsexist = async (user_id, login) => {
    let where = (login !== undefined) ? '`login` LIKE ?' : '`user_id` = ?';
    let vars = [(login !== undefined) ? login : user_id];
    let data = await usersmodel.getUsersWhere(where + ' LIMIT 1', 'NULL', vars);
    if (!data.data.length)
        return 1
    return 0;
}

exports.blockUser = async (req, res) => {
    let {login} = req.body;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assignd a login'
        });
    if (/[^a-zA-Z0-9]+/.test(req.query.login)
    || await UserIsexist(0, login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'login can\'t be found'
        });
    let userid = await usersmodel.
    getUsersWhere('`login` LIKE ? LIMIT 1', '`user_id`', [login]);
    userid = userid.data[0].user_id; 
    if (userid == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t block youself'
        });
    let data = await blocksmodel
    .getBlockedWhere('`user_id` = ? AND `to_id` = ?', 'NULL', [req.jwt.user_id, userid]);
    if (data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'already blocked'
        });
    await blocksmodel.insertblock([[[req.jwt.user_id, userid]]]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'blocked'
    });
}

exports.getBlocked = async (req, res) => {
    let data = await blocksmodel.
    getBlockedWhere('`user_id` = ? ORDER BY `created_dat` DESC', '*', [req.jwt.user_id]);
    let i = 0;
    while (i < data.length) {
        let to_imgs = await require('../model/images').
        getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT 1', [data[i].to_id]);
        let to_infos = await usersmodel.
        getUsersWhere('`user_id` = ? LIMIT 1', '`login`, `first_name`, `last_name`', [data[i].to_id]);
        data[i].to_img = (to_imgs.data.length) ? to_imgs.data[0].image_path : undefined;
        data[i].first_name = to_infos.data[0].first_name;
        data[i].last_name = to_infos.data[0].last_name;
        data[i].login = to_infos.data[0].login;
        i++;
    }
    return (
        res.status(200).json({
            success : true,
            error : false,
            data : data
        })
    );
}

exports.calcBlocked = async (req, res) => {
    let data = await blocksmodel.
    getBlockedWhere('`user_id` = ?', 'COUNT(*) as length', [req.jwt.user_id]);
    return (
        res.status(200).json({
            success : true,
            error : false,
            length : data[0].length
        })
    );
}

exports.deleteBlocked = async (req, res) => {
    let {login} = req.body;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assignd a login'
        });
    if (/[^a-zA-Z0-9]+/.test(login)
    || await UserIsexist(0, login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'login can\'t be found'
        });
    let userid = await usersmodel.
    getUsersWhere('`login` LIKE ? LIMIT 1', '`user_id`', [login]);
    userid = userid.data[0].user_id; 
    if (userid == req.jwt.user_id)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You can\'t unblock -_- youself'
        });
    let data = await blocksmodel
    .getBlockedWhere('`user_id` = ? AND `to_id` = ?', '`blocks_id`', [req.jwt.user_id, userid]);
    if (!data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You didn\'t block this user'
        });
    await blocksmodel.deleteblocks('`blocks_id` = ?', [data[0].blocks_id]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'Successfully unblock ' + login
    });
}