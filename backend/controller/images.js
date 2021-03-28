const randomString = require('randomstring');
const imgsmodel = require('../model/images');
const fs = require('fs');
// const Buffer = require('buffer');

let is_blocked = async (userid, otherid) => {
    let isblockd = await require('../model/blocks')
    .getBlockedWhere('(`user_id` = ? AND `to_id` = ?) OR (`user_id` = ? AND `to_id` = ?)'
    , 'NULL', [otherid, userid, userid, otherid]);
    if (isblockd.length)
        return true;
    return false;
}


async function generateRandomName(login, format) {
    let name = '';
    let result;

    while (1) {
        name = login + '_' + randomString.generate({
            length : 10,
            charset : 'alphanumeric'
        }) + '.' + format;
        result = await imgsmodel.getImgsWhere('`image_path` LIKE ?', name);
        if (!result.data.length)
            break ;   
    }
    return (name);
}

exports.insert_img = async (req, res, next) => {
    let result = await imgsmodel.getImgsWhere('`user_id` = ?', [req.jwt.user_id]);
    if (result.data.length > 4)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you already have 5 images !!'
        });
    let format = req.body.type.split('/')[1];
    let name = await generateRandomName(req.jwt.login, format);
    fs.writeFile('./public/users_imgs/' + name,
    req.body.data.split(',')[1], req.body.data.split(',')[0], async (err) => {
        if (err)
            return res.status(200).json({
                error : true,
                success : false,
                message : 'something going wrong while saving the image, please try again !!'
            });
        else {
            await imgsmodel.insert_img(req.jwt.user_id, name);
            return res.status(200).json({
                error : false,
                success : true,
                message : 'Image is saved successfully',
                path : name
            });
        }
    });
    return ;
}

exports.delete_img = async (req, res) => {
    let result = await imgsmodel.getImgsWhere('`image_path` LIKE ? AND `user_id` = ?', [req.body.name, req.jwt.user_id]);
    if (!result.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'this image is not exist or belong to another user'
        });
    await imgsmodel.delete_img(req.jwt.user_id, req.body.name);
    fs.unlink('./public/users_imgs/' + req.body.name, (err) => {
        if (err)
            return res.status(200).json({
                error : true,
                success : false,
                message : 'something going wrong while deleting image from storage'
            });
        return res.status(200).json({
            error : false,
            success : true,
            message : 'image deleted successfully'
        });
    });
    return ;
}

async function LoginisExist(login) {
    return (await require('../model/users').getUsersWhere('`login` LIKE ?', '`user_id`', [login]));
}

exports.get_imgs = async (req, res) => {
    const {login} = req.query;

    if (login == undefined || login == '')
        return res.status(200).json({
            success : false,
            error : true,
            message : 'you must assign a login'
        });
    let result = await LoginisExist(login);
    if (/[^A-Za-z0-9]+/.test(login) || !result.data.length)
        return res.status(200).json({
            success : false,
            error : true,
            message : 'inexistent login'
        });
    if (await is_blocked(req.jwt.user_id, result.data[0].user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'re blocked this user'
        });
    let data = await imgsmodel.getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC', [result.data[0].user_id]);
    return res.status(200).json({
        success : true,
        error : false,
        data : data.data
    });
}