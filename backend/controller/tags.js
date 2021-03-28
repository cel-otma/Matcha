const tagsmodel = require('../model/tags');
const UImodel = require('../model/uinfos');
const usersmodel = require('../model/users');

exports.insert_tags = async (req, res) => {
    req.body.user_id = req.jwt.user_id;

    await tagsmodel.Insert_inexistenttags(JSON.parse(req.body.tags));
    await tagsmodel.linktags(JSON.parse(req.body.tags), req.jwt.user_id);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'tags is added successfully'
    });
}

exports.update_tags = async (req, res) => {
    req.body.user_id = req.jwt.user_id;

    await tagsmodel.Insert_inexistenttags(JSON.parse(req.body.tags));
    await tagsmodel.linktags(JSON.parse(req.body.tags), req.jwt.user_id);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'tags is updated successfully'
    });
}

async function user_exist(login) {
    let result = await usersmodel.getUsersWhere('`login` LIKE ?', '`login`', [login]);
    if (!result.data.length)
        return (1);
    return (0);
}

function user_valide(login) {
    if (/[^A-Za-z0-9]+/.test(login))
        return (1);
    return (0);
}

exports.get_tags = async (req, res, next) => {
    const {login} = req.query;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : "missing tags user"
        });
    if (user_valide(login) || await user_exist(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : "inexist login"
        });
    let userinfo = await usersmodel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    let data = await tagsmodel.gettags_where('(`users_tags`.`user_id` = ? AND `alltags`.`tags_id` = `users_tags`.`tags_id`)', `*`, [userinfo.data[0].user_id]);
    return res.status(200).json({
        data : data.data,
        success : true,
        error : false
    });
}