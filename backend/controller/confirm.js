const ConfModel = require('../model/confirm');
const UsersModel = require('../model/users');

exports.confirm = async (req, res) => {
    const {login, key} = req.query;

    let result = await UsersModel.getUsersWhere('`login` LIKE ?', '`user_id`', [login]);
    if (!result.data.length)
        return res.status(200).json({
            success : false,
            error : true,
            message : 'login doesn\'t exist'
        });
    result = await ConfModel.getConfWhere('(`user_id` = ? AND `con_key` LIKE ?)', [result.data[0].user_id, key]);
    if (!result.data.length)
        return res.status(200).json({
            success : false,
            error : true,
            message : 'key doesn\'t exist'
        });
    await ConfModel.dropConf(result.data[0].con_id);
    return res.status(200).json({
        success : true,
        error : false,
        message : 'your account is confirmed successfully !!'
    });
}