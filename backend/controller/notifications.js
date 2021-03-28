const ntfsmodel = require('../model/notifications');
const usersmodel = require('../model/users');
const imgsmodel = require('../model/images');

exports.getntfs = async (req, res) => {
    let limit = (req.query.limit == undefined || /[^0-9]+/.test(req.query.limit)) ?
    0 : req.query.limit;
    let g_ntsid = (req.query.g_ntsid == undefined || /[^0-9]+/.test(req.query.g_ntsid)) ?
    0 : req.query.g_ntsid;
    let where = '`user_id` = ? AND `nts_id` > ?'
    let data = await ntfsmodel.getntfs_where(where, [req.jwt.user_id, g_ntsid], limit);
    let i = 0;
    while (i < data.length) {
        fromu_info = await usersmodel.getUsersWhere('`user_id` = ? LIMIT 1', '`login`, `first_name`, `last_name`', [data[i].from_id]);
        data[i].message = data[i].message.replace('<login>', fromu_info.data[0].login);
        data[i].first_name = fromu_info.data[0].first_name;
        data[i].last_name = fromu_info.data[0].last_name;
        data[i].login = fromu_info.data[0].login;
        let img = await imgsmodel.getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT 1', [data[i].from_id]);
        if (img.data.length)
            data[i].img = img.data[0].image_path; 
        i++;
    }
    let countntfs = await ntfsmodel.countntfs(req.jwt.user_id);
    let invue = await ntfsmodel.getntfs_where('`user_id` = ? AND `nts_vue` = 1', req.jwt.user_id);
    return (res.status(200).json({
        error : false,
        success : true,
        data : data,
        length : countntfs[0].length,
        invue_length : invue.length
    }))
}

exports.deleteNtfs = async (req, res) => {
    const {nts_id}  = req.body;

    let data = await ntfsmodel.getntfs_where('`nts_id` = ? AND `user_id` = ?', [nts_id, req.jwt.user_id]);
    if (!data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'notification id doesn\'t exist'
        });
    await ntfsmodel.deleteNtfs(nts_id);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'notification deleted successfully'
    });
}

exports.vu_ntfs = async (req, res) => {
    await ntfsmodel.updatentfs('`user_id`=?', '`nts_vue`=?', [2, req.jwt.user_id]);
    return res.status(200).json({
        error : false,
        success : true,
        message : 'successfully'
    });
}